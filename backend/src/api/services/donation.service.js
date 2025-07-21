const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { default: mongoose } = require("mongoose");
const ApiError = require("../utils/apiError");
const Donation = require("../models/donation.model");
const Organization = require("../models/organization.model");
const DonationSubscription = require("../models/donationSubscription.model");
const Cause = require("../models/cause.model");
const Missionary = require("../models/missionary.model");
const { createOrRetrieveCustomer } = require("./stripe.service");
const { findOrCreateDonor } = require("../services/user.service");

const createOneTimeDonationSession = async (donationDetails) => {
  const {
    donation,
    tip,
    // fee,
    missionaryCommission,
    donorEmail,
    donorName,
    targetId,
    targetType,
    targetName,
    npoCommission,
    isAnonymous,
    message,
  } = donationDetails;

  if (!targetId || !targetType) {
    throw new ApiError(
      400,
      "A donation target (missionary or cause) is required."
    );
  }
  let destinationAccountId;
  if (targetType.toLowerCase() === "missionary") {
    const missionary = await Missionary.findById(targetId).lean();

    if (!missionary || !missionary.stripeConnectId) {
      // A direct donation to a missionary who hasn't onboarded should fail.

      throw new ApiError(
        400,
        "This missionary is not currently set up to receive payments."
      );
    }
    destinationAccountId = missionary.stripeConnectId;
  } else if (targetType.toLowerCase() === "cause") {
    const cause = await Cause.findById(targetId)
      .populate("missionaryId", "stripeConnectId")
      .lean();
    if (!cause || !cause.missionaryId || !cause.missionaryId.stripeConnectId) {
      // A donation to a cause whose owner hasn't onboarded should fail.
      throw new ApiError(
        400,
        "The missionary for this cause is not currently set up to receive payments."
      );
    }
    destinationAccountId = cause.missionaryId.stripeConnectId;
  } else {
    throw new ApiError(400, "Invalid donation target type specified.");
  }
  const PLATFORM_FEE_PERCENTAGE = 0.1; // 10%
  const applicationFeeAmount = Math.round(
    donation * PLATFORM_FEE_PERCENTAGE * 100
  );
  const customer = await createOrRetrieveCustomer(donorEmail, donorName);
  const line_items = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Donation for ${targetName}`,
        },
        unit_amount: Math.round(donation * 100),
      },
      quantity: 1,
    },
  ];
  if (tip > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Platform Tip" },
        unit_amount: Math.round(tip * 100),
      },
      quantity: 1,
    });
  }
  if (missionaryCommission > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Missionary Fee" },
        unit_amount: Math.round(missionaryCommission * 100),
      },
      quantity: 1,
    });
  }
  if (npoCommission > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "NPO Commission" },
        unit_amount: Math.round(npoCommission * 100),
      },
      quantity: 1,
    });
  }
  // if (fee > 0) {
  //   line_items.push({
  //     price_data: {
  //       currency: "usd",
  //       product_data: { name: "Card Processing Fee" },
  //       unit_amount: Math.round(fee * 100),
  //     },

  //     quantity: 1,
  //   });
  // }

  const totalAmount = line_items.reduce(
    (sum, item) => sum + item.price_data.unit_amount,
    0
  );

  if (totalAmount < 50) {
    throw new ApiError(400, "Total donation amount must be at least $0.50.");
  }
    console.log("========================================");
    console.log("DEBUG: Sending this data to Stripe");
    console.log("  - Target ID:", targetId);
    console.log("  - Target Type:", targetType);
    console.log("========================================");

  try {
    console.log("+1-212-456-7890", stripe);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customer ? customer.id : undefined,
      customer_email: customer ? undefined : donorEmail,
      line_items,
      success_url: `${process.env.FRONTEND_URL}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/donation-cancel`,
      payment_intent_data: {
        transfer_data: {
          // This now correctly uses the missionary's Stripe ID
          destination: destinationAccountId,
        },
        application_fee_amount: applicationFeeAmount,
      },
      metadata: {
        targetId,
        targetType,
        donorName,
        donorEmail,
        isAnonymous: String(isAnonymous),
        donation: String(donation),
        tip: String(tip),
        //fee: String(fee),
        message: message,
      },
    });

    return session;
  } catch (error) {
    console.error("Stripe Error creating checkout session:", error.message);
    throw new ApiError(500, `Stripe Error: ${error.message}`);
  }
};

const createSubscription = async (donationDetails) => {
  const {
    paymentMethodId,
    donation,
    tip,
    donorEmail,
    donorName,
    targetId,
    targetType,
    targetName,
    isAnonymous,
    message,
  } = donationDetails;

  const TargetModel = targetType.toLowerCase() === "Cause" ? Cause : Missionary;
  const target = await TargetModel.findById(targetId);
  if (!target) {
    throw new ApiError(404, `Target ${targetType} not found.`);
  }

  const donorUser = await findOrCreateDonor(
    isAnonymous ? null : donorEmail,
    donorName,
    target.organizationId
  );
  const customer = await createOrRetrieveCustomer(donorEmail, donorName);

  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: Math.round(parseFloat(donation) * 100),
      recurring: { interval: "month" },
      product_data: {
        name: `Monthly Donation to ${targetName}`,
        metadata: {
          organizationId: target.organizationId.toString(),
          donorId: donorUser ? donorUser._id.toString() : "",
          targetId,
          targetType,
        },
      },
      metadata: {
        organizationId: target.organizationId.toString(),
        donorId: donorUser ? donorUser._id.toString() : "",
        targetId,
        targetType,
        isAnonymous: String(isAnonymous),
        donation: String(donation),
        tip: String(tip),
        message,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        organizationId: target.organizationId.toString(),
        donorId: donorUser ? donorUser._id.toString() : "",
        targetId,
        targetType,
        isAnonymous: String(isAnonymous),
        donation: String(donation),
        tip: String(tip),
        message,
      },
    });

    // ✨ CREATE the record in our database
    await DonationSubscription.create({
      organizationId: target.organizationId,
      donorId: donorUser._id,
      targetId,
      targetType,
      stripeSubscriptionId: subscription.id,
      status: subscription.status, // e.g., 'incomplete'
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    };
  } catch (error) {
    console.error("Stripe Subscription Error:", error.message);
    throw new ApiError(500, `Stripe Error: ${error.message}`);
  }
};

const calculateDonationStats = async (user, period = "thisMonth") => {
  // 1. Define the time range based on the filter
  const now = new Date();
  let startDate;

  switch (period) {
    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case "last90days":
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case "thisYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "lastYear":
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      break;
    case "thisMonth":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  // 2. Define the base match stage for multi-tenancy and time period
  const matchStage = {
    organizationId: new mongoose.Types.ObjectId(user.organizationId),
    status: "succeeded",
    createdAt: { $gte: startDate },
  };

  // Note: To filter for a specific missionary, you would add more to the matchStage here.

  // 3. Build the aggregation pipeline using $facet
  const stats = await Donation.aggregate([
    { $match: matchStage },
    {
      $facet: {
        totalRaised: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
        causeTotal: [
          { $match: { targetType: "Cause" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
        totalDonors: [
          { $match: { donorId: { $ne: null } } },
          { $group: { _id: "$donorId" } },
          { $count: "count" },
        ],
        monthlyDonors: [
          { $match: { donorId: { $ne: null } } },
          { $group: { _id: "$donorId" } },
          { $count: "count" },
        ],
        causeDonors: [
          { $match: { targetType: "Cause", donorId: { $ne: null } } },
          { $group: { _id: "$donorId" } },
          { $count: "count" },
        ],
      },
    },
  ]);

  // 4. Format the result into a clean object
  const result = {
    totalRaised: stats[0].totalRaised[0]?.total || 0,
    causeTotal: stats[0].causeTotal[0]?.total || 0,
    totalDonors: stats[0].totalDonors[0]?.count || 0,
    monthlyTotal: stats[0].totalRaised[0]?.total || 0,
    monthlyDonors: stats[0].monthlyDonors[0]?.count || 0,
    causeDonors: stats[0].causeDonors[0]?.count || 0,
  };

  // For "Monthly Totals", we can just reuse the "totalRaised" since it's already filtered by time.
  result.monthlyTotal = result.totalRaised;

  return result;
};

const listDonationsOverview = async (user, period = "thisMonth") => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case "last90days":
      startDate = new Date(new Date().setDate(now.getDate() - 90));
      break;
    case "thisYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "lastYear":
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      break;
    case "thisMonth":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const matchStage = {
    organizationId: new mongoose.Types.ObjectId(user.organizationId),
    status: "succeeded",
    createdAt: { $gte: startDate },
  };

  const pipeline = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    // Lookup for Cause information
    {
      $lookup: {
        from: "causes",
        localField: "targetId",
        foreignField: "_id",
        as: "causeInfo",
      },
    },
    // Lookup for Missionary information
    {
      $lookup: {
        from: "missionaries",
        localField: "targetId",
        foreignField: "_id",
        as: "missionaryInfo",
      },
    },
    // Deconstruct the arrays from the lookups
    { $unwind: { path: "$causeInfo", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$missionaryInfo", preserveNullAndEmptyArrays: true } },
    // If it's a missionary, lookup their user details
    {
      $lookup: {
        from: "users",
        localField: "missionaryInfo.userId",
        foreignField: "_id",
        as: "missionaryUserInfo",
      },
    },
    {
      $unwind: {
        path: "$missionaryUserInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        donorName: 1,
        amount: 1,
        donationType: 1,
        targetType: 1,
        organizationId: 1,
        donorId: 1,
        stripePaymentIntentId: 1,
        status: 1,
        targetId: {
          _id: "$targetId",
          name: {
            $cond: {
              if: { $eq: ["$targetType", "Cause"] },
              then: "$causeInfo.name",
              else: {
                $concat: [
                  "$missionaryUserInfo.firstName",
                  " ",
                  "$missionaryUserInfo.lastName",
                ],
              },
            },
          },
        },
      },
    },
  ];

  const donations = await Donation.aggregate(pipeline);

  return donations;
};

const listDonations = async (user, queryParams) => {
  const {
    page = 1,
    limit = 10,
    search,
    minAmount,
    maxAmount,
    donationType,
    causeId,
  } = queryParams;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const pipeline = [];

  const initialMatchStage = {
    organizationId: new mongoose.Types.ObjectId(user.organizationId),
    status: "succeeded",
  };

  if (minAmount || maxAmount) {
    initialMatchStage.amount = {};
    if (minAmount) initialMatchStage.amount.$gte = parseFloat(minAmount);
    if (maxAmount) initialMatchStage.amount.$lte = parseFloat(maxAmount);
  }
  if (donationType) {
    initialMatchStage.donationType = donationType;
  }
  if (causeId) {
    initialMatchStage.targetId = new mongoose.Types.ObjectId(causeId);
    initialMatchStage.targetType = "Cause";
  }
  pipeline.push({ $match: initialMatchStage });

  if (user.role === "missionary") {
    const missionary = await Missionary.findOne({ userId: user._id }).lean();
    if (!missionary) {
      return {
        data: [],
        pagination: { currentPage: 1, totalPages: 0, totalDonations: 0 },
      };
    }
    const missionaryCauseIds = await Cause.find({
      missionaryId: missionary._id,
    })
      .select("_id")
      .lean()
      .then((causes) => causes.map((c) => c._id));

    pipeline.push({
      $match: {
        $or: [
          { targetType: "Missionary", targetId: missionary._id },
          { targetType: "Cause", targetId: { $in: missionaryCauseIds } },
        ],
      },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "donorId",
        foreignField: "_id",
        as: "donorInfo",
      },
    },
    { $unwind: { path: "$donorInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "causes",
        localField: "targetId",
        foreignField: "_id",
        as: "causeInfo",
      },
    },
    { $unwind: { path: "$causeInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "missionaries",
        localField: "targetId",
        foreignField: "_id",
        as: "missionaryInfo",
      },
    },
    { $unwind: { path: "$missionaryInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "missionaryInfo.userId",
        foreignField: "_id",
        as: "missionaryUserInfo",
      },
    },
    {
      $unwind: {
        path: "$missionaryUserInfo",
        preserveNullAndEmptyArrays: true,
      },
    }
  );

  pipeline.push({
    $addFields: {
      targetName: {
        $cond: {
          if: { $eq: ["$targetType", "Cause"] },
          then: "$causeInfo.name",
          else: {
            $concat: [
              "$missionaryUserInfo.firstName",
              " ",
              "$missionaryUserInfo.lastName",
            ],
          },
        },
      },
    },
  });

  // ✨ ENHANCEMENT: Search now includes the 'amount' field.
  if (search) {
    // Base search conditions for text fields
    const searchConditions = [
      { donorName: { $regex: search, $options: "i" } },
      { donorEmail: { $regex: search, $options: "i" } },
      { targetName: { $regex: search, $options: "i" } },
    ];

    // Check if the search term can be treated as a number
    const numericSearchValue = Number(search);
    if (!isNaN(numericSearchValue) && isFinite(search)) {
      // If it's a valid number, add a condition to search the 'amount' field for an exact match
      searchConditions.push({ amount: numericSearchValue });
    }

    pipeline.push({
      $match: {
        $or: searchConditions,
      },
    });
  }

  const countResult = await Donation.aggregate([
    ...pipeline,
    { $count: "total" },
  ]);
  const totalDonations = countResult[0]?.total || 0;

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limitNum },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        donorName: 1,
        amount: 1,
        donationType: 1,
        targetType: 1,
        targetId: {
          _id: "$targetId",
          name: "$targetName",
        },
      },
    }
  );

  const donations = await Donation.aggregate(pipeline);

  return {
    data: donations,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalDonations / limitNum),
      totalDonations,
    },
  };
};

/**
 * @description Fetches a paginated and filterable list of donations for the LOGGED-IN DONOR.
 * @param {object} user - The authenticated user object (role: 'donor').
 * @param {object} queryParams - Filters from the request query.
 * @returns {Promise<object>} A promise that resolves to the paginated list of the donor's payments.
 */
const listMyDonationsAsDonor = async (user, queryParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "date",
    sortOrder = "desc",
  } = queryParams;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const matchStage = {
    donorId: new mongoose.Types.ObjectId(user._id),
    status: "succeeded",
  };

  const pipeline = [
    { $match: matchStage },
    // Lookup for both Cause and Missionary
    {
      $lookup: {
        from: "causes",
        localField: "targetId",
        foreignField: "_id",
        as: "cause",
      },
    },
    {
      $lookup: {
        from: "missionaries",
        localField: "targetId",
        foreignField: "_id",
        as: "missionary",
      },
    },
    // Unwind the arrays
    { $unwind: { path: "$cause", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$missionary", preserveNullAndEmptyArrays: true } },
    // Lookup for missionary's user info if it's a missionary donation
    {
      $lookup: {
        from: "users",
        localField: "missionary.userId",
        foreignField: "_id",
        as: "missionaryUser",
      },
    },
    { $unwind: { path: "$missionaryUser", preserveNullAndEmptyArrays: true } },
    // Lookup for cause's missionary info if it's a cause donation
    {
      $lookup: {
        from: "missionaries",
        localField: "cause.missionaryId",
        foreignField: "_id",
        as: "causeMissionary",
      },
    },
    { $unwind: { path: "$causeMissionary", preserveNullAndEmptyArrays: true } },
    // Lookup for cause missionary's user info
    {
      $lookup: {
        from: "users",
        localField: "causeMissionary.userId",
        foreignField: "_id",
        as: "causeMissionaryUser",
      },
    },
    {
      $unwind: {
        path: "$causeMissionaryUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Determine the target name based on donation type
    {
      $addFields: {
        targetName: {
          $cond: {
            if: { $eq: ["$targetType", "Cause"] },
            then: {
              $concat: [
                "$cause.name",
                " (",
                "$causeMissionaryUser.firstName",
                " ",
                "$causeMissionaryUser.lastName",
                ")",
              ],
            },
            else: {
              $concat: [
                "$missionaryUser.firstName",
                " ",
                "$missionaryUser.lastName",
              ],
            },
          },
        },
      },
    },
  ];

  // Apply search filter if provided
  if (search) {
    pipeline.push({
      $match: {
        targetName: { $regex: search, $options: "i" },
      },
    });
  }

  // Apply sorting
  const sortStage = {};
  if (["date", "amount", "targetName"].includes(sortBy)) {
    sortStage[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sortStage["date"] = -1; // Default sort
  }
  pipeline.push({ $sort: sortStage });

  // Get total count
  const countPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await Donation.aggregate(countPipeline);
  const totalCount = totalResult[0]?.total || 0;

  // Apply pagination
  pipeline.push({ $skip: skip }, { $limit: limitNum });

  // Final projection
  pipeline.push({
    $project: {
      _id: 1,
      date: "$createdAt",
      amount: 1,
      donationType: 1,
      status: 1,
      target: "$targetName",
      stripePaymentIntentId: 1,
    },
  });

  const payments = await Donation.aggregate(pipeline);

  return {
    data: payments,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    },
  };
};

/**
 * Retrieves the live receipt URL for a given Stripe Payment Intent.
 * @param {string} paymentIntentId The ID of the Stripe Payment Intent (pi_...).
 * @returns {Promise<string>} The URL of the hosted receipt.
 */
const getStripeReceiptUrl = async (paymentIntentId) => {
  if (!paymentIntentId) {
    throw new ApiError(400, "Payment Intent ID is required.");
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["charges.data"],
      }
    );

    const charge = paymentIntent?.charges?.data?.[0];

    // The rest of the logic remains the same, but is now safe
    if (!charge || !charge.receipt_url) {
      throw new ApiError(
        404,
        "Receipt not available. The payment may have failed or is still processing."
      );
    }

    return charge.receipt_url;
  } catch (error) {
    console.error("Stripe API error fetching receipt:", error.message);
    // Throw a more specific error if it's our custom one
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.statusCode || 500,
      `Stripe Error: ${error.message}`
    );
  }
};

const generateFundraisingReportForMissionary = async (user) => {
  // 1. Find the missionary profile from the user ID
  const missionary = await Missionary.findOne({ userId: user._id }).lean();
  if (!missionary) {
    throw new ApiError(
      404,
      "Missionary profile not found for the current user."
    );
  }

  // 2. Find all causes created by this missionary
  const missionaryCauseIds = await Cause.find({ missionaryId: missionary._id })
    .select("_id")
    .lean()
    .then((causes) => causes.map((c) => c._id));

  // 3. Define the query to find all relevant donations
  const donationQuery = {
    status: "succeeded",
    $or: [
      { targetType: "Missionary", targetId: missionary._id },
      { targetType: "Cause", targetId: { $in: missionaryCauseIds } },
    ],
  };

  // 4. Use aggregation to calculate stats
  const statsPipeline = [
    { $match: donationQuery },
    {
      $group: {
        _id: null,
        totalRaised: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        donors: { $addToSet: "$donorEmail" }, // Use email to count unique donors
      },
    },
    {
      $project: {
        _id: 0,
        totalRaised: 1,
        donationCount: 1,
        donorCount: { $size: "$donors" },
      },
    },
  ];

  const statsResult = await Donation.aggregate(statsPipeline);
  const stats = statsResult[0] || {
    totalRaised: 0,
    donationCount: 0,
    donorCount: 0,
  };

  // 5. Fetch the 10 most recent donations for the list
  const recentDonations = await Donation.find(donationQuery)
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("targetId", "name") // Populate the cause/missionary name
    .lean();

  // 6. Format the response
  const formattedDonations = recentDonations.map((d) => ({
    ...d,
    targetName: d.targetId?.name || "Direct Donation",
  }));

  return {
    stats,
    recentDonations: formattedDonations,
  };
};

module.exports = {
  createOneTimeDonationSession,
  calculateDonationStats,
  listDonationsOverview,
  listDonations,
  listMyDonationsAsDonor,
  getStripeReceiptUrl,
  createSubscription,
  generateFundraisingReportForMissionary,
};
