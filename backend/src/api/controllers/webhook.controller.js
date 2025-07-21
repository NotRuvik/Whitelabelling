const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Donation = require("../models/donation.model");
const Cause = require("../models/cause.model");
const Missionary = require("../models/missionary.model");
const Notification = require("../models/notification.model");
const DonationSubscription = require("../models/donationSubscription.model");
const { findOrCreateDonor } = require("../services/user.service");

const handleStripeWebhook = async (req, res) => {
  console.log("Hellow");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // --- FULFILL THE ORDER ---
    try {
      const metadata = session.metadata;
      const {
        targetId,
        targetType,
        donorEmail,
        donorName,
        isAnonymous,
        donation,
        message,
      } = metadata;
      const donationAmount = parseFloat(donation);

      // 1. Find the target to get the organizationId for multi-tenancy
      // const TargetModel = targetType === "cause" ? Cause : Missionary;
      // const target = await TargetModel.findById(targetId).populate({
      //   path: 'userId',
      //   select: 'firstName lastName'
      // });
      let target;
      if (targetType != "cause") {
        target = await Missionary.findById(targetId).populate({
          path: "userId",
          select: "firstName lastName",
        });
      } else {
        target = await Cause.findById(targetId); // No need to populate for cause
      }

      // const target = await TargetModel.findById(targetId);
      if (!target) {
        throw new Error(
          `Donation target ${targetType} with ID ${targetId} not found.`
        );
      }
      const organizationId = target.organizationId;

      // 2. Find or create the donor user (if not anonymous)
      const donorUser = await findOrCreateDonor(
        isAnonymous === "true" ? null : donorEmail,
        donorName,
        organizationId
      );
      const donationType =
        session.mode === "subscription" ? "monthly" : "one-time";
      // 3. Create the Donation record in our database
      const newDonation = new Donation({
        organizationId,
        donorId: donorUser ? donorUser._id : null,
        targetId,
        targetType:
          targetType.charAt(0).toUpperCase() +
          targetType.slice(1).toLowerCase(),
        donationType: donationType,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        amount: parseFloat(metadata.donation || "0"),
        tip: parseFloat(metadata.tip || "0"),
        //fee: parseFloat(metadata.fee),
        fee: parseFloat(metadata.fee || "0"),
        totalAmount: session.amount_total / 100,
        status: "succeeded",
        isAnonymous: isAnonymous === "true",
        donorName,
        donorEmail,
        message: message,
      });
      await newDonation.save();

      try {
        console.log("targetType:", targetType);
        console.log("Fetched target:", target);
        console.log("Fetched userId (if missionary):", target?.userId);
        let recipientName = "an unknown recipient";

        if (targetType === "cause" && target?.name) {
          recipientName = target.name;
        } else if (targetType === "Missionary" && target?.userId?.firstName) {
          recipientName = `${target.userId.firstName} ${target.userId.lastName}`;
        } else if (targetType === "Missionary") {
          recipientName = `a Missionary (ID: ${target._id})`;
        }

        const notificationMessage = `A donation of $${newDonation.amount.toFixed(
          2
        )} was made to ${recipientName}.`;

        await Notification.create({
          recipientRole: "super_admin",
          message: notificationMessage,
        });

        console.log(
          "✅ Super admin notification created successfully with message:",
          notificationMessage
        );
      } catch (err) {
        console.error("❌ ERROR creating super admin notification:", err);
      }

      // 4. If it was a donation to a cause, update the cause's raisedAmount
      if (targetType.toLowerCase() === "cause") {
        // Atomically increment the raised amount and get the updated document
        const updatedCause = await Cause.findByIdAndUpdate(
          targetId,
          { $inc: { raisedAmount: donationAmount } },
          { new: true } // This option returns the document *after* the update
        );

        // Now, checking if the goal has been met or exceeded
        if (
          updatedCause &&
          updatedCause.raisedAmount >= updatedCause.goalAmount
        ) {
          // If the cause is not already marked as completed, update it.
          if (!updatedCause.isCompleted) {
            updatedCause.isCompleted = true;
            await updatedCause.save();
            console.log(
              `Cause ${updatedCause._id} has been marked as completed.`
            );
          }
        }
      }

      console.log(`Successfully processed donation ${newDonation._id}`);
    } catch (error) {
      console.error("Error fulfilling order:", error.message);
      return res.status(500).json({ error: "Failed to process donation." });
    }
  }
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    if (invoice.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription
        );
        const {
          organizationId,
          donorId,
          targetId,
          targetType,
          isAnonymous,
          message,
          tip,
        } = subscription.metadata;
        await Donation.create({
          organizationId,
          donorId: donorId || null,
          targetId,
          targetType:
            targetType.charAt(0).toUpperCase() +
            targetType.slice(1).toLowerCase(),
          donationType: "monthly",
          stripeSubscriptionId: subscription.id,
          stripePaymentIntentId: invoice.payment_intent,
          amount: invoice.amount_paid / 100 - parseFloat(tip || 0),
          tip:
            invoice.billing_reason === "subscription_create"
              ? parseFloat(tip || 0)
              : 0,
          totalAmount: invoice.amount_paid / 100,
          status: "succeeded",
          isAnonymous: isAnonymous === "true",
          donorName: invoice.customer_name,
          donorEmail: invoice.customer_email,
          message:
            invoice.billing_reason === "subscription_create" ? message : "",
        });

        await DonationSubscription.findOneAndUpdate(
          {
            stripeSubscriptionId: subscription.id,
          },
          {
            status: "active",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        );
        try {
          const TargetModel = targetType === "cause" ? Cause : Missionary;
          const target = await TargetModel.findById(targetId).populate({
            path: "userId",
            select: "firstName lastName",
          });
          if (target) {
            const recipientName =
              targetType === "cause"
                ? target.name
                : `${target.userId.firstName} ${target.userId.lastName}`;
            const notificationMessage = `A recurring donation of $${(
              invoice.amount_paid / 100
            ).toFixed(2)} was made to ${recipientName}.`;
            await Notification.create({
              recipientRole: "super_admin",
              message: notificationMessage,
            });
          }
        } catch (err) {
          console.error(
            "Failed to create super admin notification for recurring donation:",
            err
          );
        }
        if (targetType.toLowerCase() === "cause") {
          await Cause.findByIdAndUpdate(targetId, {
            $inc: { raisedAmount: invoice.amount_paid / 100 },
          });
        }
      } catch (error) {
        console.error("Error processing recurring donation:", error.message);
      }
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    try {
      const updateData = { status: subscription.status };

      if (subscription.current_period_end) {
        updateData.currentPeriodEnd = new Date(
          subscription.current_period_end * 1000
        );
      }

      await DonationSubscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        updateData,
        { upsert: false }
      );
    } catch (error) {
      console.error(
        `Error updating subscription status for ${subscription.id}:`,
        error.message
      );
    }
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

module.exports = {
  handleStripeWebhook,
};
