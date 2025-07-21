const stripeService = require("../services/stripe.service");
const ApiResponse = require("../utils/apiResponse");
const Missionary = require("../models/missionary.model");
const Organization = require("../models/organization.model");

const onboardNpo = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const url = await stripeService.createOrGetConnectAccountLink(orgId);
    res
      .status(200)
      .json(new ApiResponse(200, { url }, "Stripe onboarding link created."));
  } catch (error) {
    next(error);
  }
};

const disconnectNpoStripeAccount = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    if (!org) return next(new ApiError(404, "Organization not found."));

    if (org.stripeConnectId) {
      await stripeService.deleteNpoStripeAccount(org.stripeConnectId);
    }

    org.stripeConnectId = null;
    await org.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Stripe account disconnected successfully.")
      );
  } catch (error) {
    next(error);
  }
};

const manageNpoStripeAccount = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    if (!org || !org.stripeConnectId) {
      return next(
        new ApiError(404, "Stripe account not found for this organization.")
      );
    }

    const url = await stripeService.createUpdateNpoConnectStripeAccountLink(
      org.stripeConnectId,
      org._id
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, { url }, "Stripe account management link created.")
      );
  } catch (error) {
    next(error);
  }
};

const onboardMissionary = async (req, res, next) => {
  try {
    // 1. Find the missionary profile that is linked to the currently authenticated user (from the JWT token).
    const missionary = await Missionary.findOne({ userId: req.user._id });
    if (!missionary) {
      // This error occurs if a user with role 'missionary' logs in but has no associated missionary profile document.
      return next(
        new ApiError(404, "Missionary profile not found for this user.")
      );
    }

    // 2. Call the service function, passing the unique ID of the missionary's profile document.
    const url = await stripeService.createMissionaryConnectAccountLink(
      missionary._id
    );

    // 3. Send the generated URL back to the frontend.
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url },
          "Stripe onboarding link for missionary created."
        )
      );
  } catch (error) {
    // Pass any errors to the global error handler.
    next(error);
  }
};

const disconnectMissionaryStripeAccount = async (req, res, next) => {
  try {
    const missionary = await Missionary.findOne({ userId: req.user._id });
    if (!missionary) {
      return next(new ApiError(404, "Missionary profile not found."));
    }

    // Optional: Delete Stripe account from Stripe
    if (missionary.stripeConnectId) {
      await stripeService.deleteMissionaryConnectStripeAccount(
        missionary.stripeConnectId
      );
    }

    // Remove local reference
    missionary.stripeConnectId = null;
    await missionary.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Stripe account disconnected successfully.")
      );
  } catch (error) {
    next(error);
  }
};

const manageMissionaryStripeAccount = async (req, res, next) => {
  try {
    const missionary = await Missionary.findOne({ userId: req.user._id });
    if (!missionary || !missionary.stripeConnectId) {
      return next(
        new ApiError(404, "Stripe account not found for this missionary.")
      );
    }

    const url =
      await stripeService.createUpdateMissionaryConnectStripeAccountLink(
        missionary.stripeConnectId
      );
    res
      .status(200)
      .json(
        new ApiResponse(200, { url }, "Stripe account management link created.")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  onboardNpo,
  onboardMissionary,
  disconnectMissionaryStripeAccount,
  manageMissionaryStripeAccount,
  disconnectNpoStripeAccount,
  manageNpoStripeAccount,
};
