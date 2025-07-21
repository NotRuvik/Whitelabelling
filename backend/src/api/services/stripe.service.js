const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError"); // Assuming you use this for error handling
const Organization = require("../models/organization.model");
const Missionary = require("../models/missionary.model");
/**
 * Finds a customer by email or creates a new one.
 * @param {string} email - The customer's email address.
 * @param {string} name - The customer's name.
 * @returns {object} The Stripe Customer object.
 */
const createOrRetrieveCustomer = async (email, name) => {
  const existingCustomers = await stripe.customers.list({ email, limit: 1 });

  if (existingCustomers.data.length) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({
    email,
    name,
    description: `Customer for ${email}`,
  });
};

/**
 * Attaches a payment method to a customer and creates a new subscription.
 * @param {string} customerId - The Stripe Customer ID.
 * @param {string} paymentMethodId - The Payment Method ID from the frontend (pm_...).
 * @param {string} priceId - The Stripe Price ID for the selected plan.
 * @returns {object} The new Stripe Subscription object.
 */
const createStripeSubscription = async (
  customerId,
  paymentMethodId,
  priceId
) => {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    return subscription;
  } catch (error) {
    console.error("Stripe Error:", error.message);
    throw new ApiError(400, `Stripe Error: ${error.message}`);
  }
};

const createOrGetConnectAccountLink = async (orgId) => {
  const organization = await Organization.findById(orgId);
  if (!organization) {
    throw new ApiError(404, "Organization not found.");
  }

  let accountId = organization.stripeConnectId;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: organization.email,
      business_type: "non_profit",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    accountId = account.id;
    organization.stripeConnectId = accountId;
    await organization.save();
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.FRONTEND_URL}/stripe/reauth?orgId=${orgId}`,
    return_url: `${process.env.FRONTEND_URL}/dashboard/settings?orgId=${orgId}`,
    type: "account_onboarding",
  });

  return accountLink.url;
};

const deleteNpoStripeAccount = async (accountId) => {
  try {
    await stripe.accounts.del(accountId);
  } catch (error) {
    throw new ApiError(400, `Failed to delete Stripe account: ${error.message}`);
  }
};

const createUpdateNpoConnectStripeAccountLink = async (accountId, orgId) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.FRONTEND_URL}/profile/settings?reauth=true`,
    return_url: `${process.env.FRONTEND_URL}/profile/settings`,
    type: 'account_onboarding',
  });

  return accountLink.url;
};

/**
 * Creates a Stripe Express Account for a Missionary if one doesn't already exist,
 * then creates and returns a single-use onboarding link for them.
 * @param {string} missionaryId - The MongoDB _id of the missionary document.
 * @returns {Promise<string>} The URL for the Stripe Connect onboarding flow.
 */
const createMissionaryConnectAccountLink = async (missionaryId) => {
  // 1. Fetch the full missionary document from the database, populating the user details to get their email.
  const missionary = await Missionary.findById(missionaryId).populate(
    "userId",
    "email"
  );
  if (!missionary) {
    throw new ApiError(404, "Missionary profile not found.");
  }
  if (!missionary.userId || !missionary.userId.email) {
    throw new ApiError(
      404,
      "Missionary email not found, cannot create Stripe account."
    );
  }

  let accountId = missionary.stripeConnectId;

  // 2. If the missionary does not have a `stripeConnectId` saved in their profile, create a new one.
  if (!accountId) {
    console.log(
      `Creating new Stripe Connect account for missionary: ${missionary.userId.email}`
    );

    const account = await stripe.accounts.create({
      type: "express",
      email: missionary.userId.email,
      business_type: "individual", // Missionaries are typically onboarded as individuals.
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save the newly created Stripe account ID to the missionary's document in your database.
    accountId = account.id;
    missionary.stripeConnectId = accountId;
    await missionary.save();
  } else {
    console.log(
      `Using existing Stripe account ${accountId} for missionary: ${missionary.userId.email}`
    );
  }

  // 3. Generate a new, single-use Account Link. This link allows the missionary to either
  //    complete onboarding for the first time or update their existing details.
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    // URL to redirect to if the link expires. Your frontend should handle this by calling the onboarding endpoint again.
    refresh_url: `${process.env.FRONTEND_URL}/profile/wallet?reauth=true`,
    // URL to redirect to after the user successfully completes the Stripe flow.
    return_url: `${process.env.FRONTEND_URL}/profile/wallet`,
    type: "account_onboarding",
  });

  // 4. Return the generated URL to the controller.
  return accountLink.url;
};

const deleteMissionaryConnectStripeAccount = async (accountId) => {
  try {
    await stripe.accounts.del(accountId);
  } catch (error) {
    throw new ApiError(400, `Failed to delete Stripe account: ${error.message}`);
  }
};

const createUpdateMissionaryConnectStripeAccountLink = async (accountId) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.FRONTEND_URL}/profile/wallet?reauth=true`,
    return_url: `${process.env.FRONTEND_URL}/profile/wallet`,
    type: 'account_onboarding', // Yes, still "account_onboarding" for edits too
  });

  return accountLink.url;
};



module.exports = {
  createOrRetrieveCustomer,
  createStripeSubscription,
  //createConnectAccount
  createOrGetConnectAccountLink,
   deleteNpoStripeAccount,
  createUpdateNpoConnectStripeAccountLink,
  createMissionaryConnectAccountLink,
  deleteMissionaryConnectStripeAccount,
  createUpdateMissionaryConnectStripeAccountLink
};
