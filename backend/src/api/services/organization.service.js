const Organization = require("../models/organization.model");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");
const Plan = require("../models/plan.model");
const Subscription = require("../models/subscription.model");
const Notification = require("../models/notification.model");
const stripeService = require("./stripe.service");
const { sendEmail } = require("./email.service");
const {
  organizationRegistrationTemplate,
  organizationApprovedWithCredentialsTemplate,
  adminNotificationTemplate,
  organizationBlockedTemplate,
  organizationUnblockedTemplate,
  organizationRejectedTemplate,
} = require("../utils/emailTemplates");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");

const registerOrganization = async (registrationData) => {
  const plainPassword = crypto.randomBytes(6).toString("hex");
  // 1. Check for existing org (no change)
  const existingOrg = await Organization.findOne({
    $or: [
      { domainSlug: registrationData.domainSlug },
      { email: registrationData.email },
    ],
  });
  if (existingOrg) {
    throw new ApiError(
      409,
      "An organization with this email or domain already exists."
    );
  }

  // 2. Fetch plan details, including the Stripe Price ID
  const plan = await Plan.findOne({
    name: registrationData.planType,
    isActive: true,
  });
  if (!plan || !plan.stripePriceId) {
    throw new ApiError(
      404,
      "Plan not found or is not configured for subscriptions."
    );
  }
  // 3. Create Stripe Customer and create the recurring Subscription
  const stripeCustomer = await stripeService.createOrRetrieveCustomer(
    registrationData.email,
    registrationData.name,
    
  );
  const stripeSubscription = await stripeService.createStripeSubscription(
    stripeCustomer.id,
    registrationData.paymentMethodId,
    plan.stripePriceId 
  );

  // 4. Create the Organization (Tenant) with subscription details
  const newOrg = new Organization({
    name: registrationData.name,
    email: registrationData.email,
    domainSlug: registrationData.domainSlug,
    logoUrl: registrationData.logoUrl,
    backgroundColor: registrationData.backgroundColor,
    themeColor: registrationData.themeColor,
    stripeCustomerId: stripeCustomer.id,
    plan: plan.name,
    stripeSubscriptionId: stripeSubscription.id,
    subscriptionStatus: stripeSubscription.status,
    subscriptionEndDate: new Date(stripeSubscription.current_period_end * 1000),
    status: "pending_approval",
  });
  await newOrg.save();

  // 5. Create the first NPO Admin User (no change)
  const adminUser = new User({
    firstName: registrationData.firstName,
    lastName: registrationData.lastName,
    email: registrationData.email,
    password: plainPassword,
    role: "npo_admin",
    organizationId: newOrg._id,
  });
  await adminUser.save();

  newOrg.registeredBy = adminUser._id;
  await newOrg.save();

  // 6. Create a historical log of the new subscription
  const newSubscriptionLog = new Subscription({
    organizationId: newOrg._id,
    plan: plan.name,
    stripeSubscriptionId: stripeSubscription.id,
    status: stripeSubscription.status,
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
  });
  await newSubscriptionLog.save();

  // 7. Record the initial successful payment from the subscription's first invoice
  const paymentIntent = stripeSubscription.latest_invoice.payment_intent;
  const newPayment = new Payment({
    organizationId: newOrg._id,
    userId: adminUser._id,
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount, // Amount is from the payment intent
    status: "succeeded",
  });
  await newPayment.save();

  // 8. Send Emails (no change)
  const emailData = {
    name: newOrg.name,
    email: newOrg.email,
    domainSlug: newOrg.domainSlug,
    planType: newOrg.plan,
    price: paymentIntent.amount,
    paymentIntentId: paymentIntent.id,
  };
  await newOrg.save();
  await adminUser.save();
  const superAdmins = await User.find({ role: "super_admin" });

  // 2. Create a notification for each super admin
  const notificationPromises = superAdmins.map((admin) => {
    return Notification.create({
      recipientUserId: admin._id,
      message: `New organization "${newOrg.name}" is pending approval.`,
    });
  });
  await Promise.all(notificationPromises);
 
  sendEmail(
    process.env.ADMIN_EMAIL, 
    `New Organization Pending Approval: ${newOrg.name}`,
    adminNotificationTemplate(emailData)
  ).catch((err) => console.error("Failed to send admin notification:", err));
  return newOrg;
};

// const getAllOrganizations = async () => {
//   try {
//     const organizations = await Organization.find().sort({ createdAt: -1 }); 
//     return organizations;
//   } catch (error) {
//     console.error("Error fetching organizations:", error);
//     throw error;
//   }
// };
const getAllOrganizations = async ({ page = 1, perPage = 10, search = '', filter = {}, sortField = "", sortOrder = "asc",} = {}) => {
  try {
    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { domainSlug: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply additional filters
    // if (filter && typeof filter === 'object') {
    //   Object.entries(filter).forEach(([key, value]) => {
    //     if (value !== undefined && value !== '') {
    //       query[key] = value;
    //     }
    //   });
    // }

    // Handle sorting logic
    // const sort = {};
    // if (sortField) {
    //   sort[sortField] = sortOrder === 'asc' ? 1 : -1;
    // }

    const skip = (page - 1) * perPage;
    const organizations = await Organization.find(query)
      .sort({createdAt:-1})
      .skip(skip)
      .limit(perPage);

    const total = await Organization.countDocuments(query);
    return {
      data: organizations,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage)
    };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};



// const getAllOrganizations = async ({ page = 1, perPage = 10, search = '', filter = {} } = {}) => {
//   try {
//     const query = {};

//     // Search by name or email
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Apply additional filters (e.g., status, plan)
//     // Object.assign(query, filter);

//     if (filter && typeof filter === 'object') {
//       Object.entries(filter).forEach(([key, value]) => {
//         if (value !== undefined && value !== '') {
//           query[key] = value;
//         }
//       });
//     }



//     const skip = (page - 1) * perPage;
//     const organizations = await Organization.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(perPage);

//     const total = await Organization.countDocuments(query); 
//     return {
//       data: organizations,
//       total,
//       page,
//       perPage,
//       totalPages: Math.ceil(total / perPage)
//     };
//   } catch (error) {
//     console.error("Error fetching organizations:", error);
//     throw error;
//   }
// };

// const getAllOrganizations = async ({ page = 1, perPage = 10, search = '', filter = {} } = {}) => {
//   // Dummy data for testing
//   const dummyOrganizations = Array.from({ length: 50 }, (_, i) => ({
//     _id: `org${i + 1}`,
//     name: `Organization ${i + 1}`,
//     email: `org${i + 1}@test.com`,
//     domainSlug: `org${i + 1}`,
//     status: i % 2 === 0 ? 'active' : 'pending_approval',
//     createdAt: new Date(Date.now() - i * 1000000)
//   }));

//   // Basic search (by name or email)
//   let filtered = dummyOrganizations;
//   if (search) {
//     const lowerSearch = search.toLowerCase();
//     filtered = filtered.filter(org =>
//       org.name.toLowerCase().includes(lowerSearch) ||
//       org.email.toLowerCase().includes(lowerSearch)
//     );
//   }

//   // Basic column filter (e.g., status)
//   Object.keys(filter).forEach(key => {
//     filtered = filtered.filter(org => org[key] === filter[key]);
//   });

//   // Pagination
//   const total = filtered.length;
//   const start = (page - 1) * perPage;
//   const paginated = filtered.slice(start, start + perPage);

//   return {
//     data: paginated,
//     page,
//     perPage,
//     total,
//     totalPages: Math.ceil(total / perPage)
//   };
// };


const updateOrganizationStatus = async (orgId, status) => {
  const organization = await Organization.findById(orgId);
  if (!organization) throw new ApiError(404, "Organization not found");

  const adminUser = await User.findOne({
    organizationId: orgId,
    role: "npo_admin",
  });
  if (!adminUser)
    throw new ApiError(404, "Admin user for this organization not found");

  // --- ON APPROVAL ---
  if (status === "active") {
    // Generate a secure temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");

    // Update the user's password with the temporary one
    adminUser.password = tempPassword;
    await adminUser.save(); // The pre-save hook will hash it

    // Send the approval email WITH credentials
    const emailTemplate = organizationApprovedWithCredentialsTemplate({
      orgName: organization.name,
      loginEmail: adminUser.email,
      tempPassword: tempPassword,
    });
    sendEmail(
      adminUser.email,
      "Your Organization has been Approved!",
      emailTemplate
    ).catch((err) =>
      console.error(`Failed to send approval email to ${adminUser.email}:`, err)
    );

    // Create an in-app notification for the NPO's dashboard
    await Notification.create({
      organizationId: orgId,
      message: `Congratulations! Your organization, ${organization.name}, has been approved. Welcome aboard!`,
    });
  }

  if (status === "rejected") {
    const emailTemplate = organizationRejectedTemplate({
      orgName: organization.name,
    });
    sendEmail(
      adminUser.email,
      "Update on Your Organization Registration",
      emailTemplate
    ).catch((err) =>
      console.error(
        `Failed to send rejection email to ${adminUser.email}:`,
        err
      )
    );
  }

  organization.status = status;
  await organization.save();
  return organization;
};

const reviewOrganization = async (orgId, decision) => {
  const organization = await Organization.findById(orgId);
  if (!organization) throw new ApiError(404, "Organization not found");
  if (organization.status !== "pending_approval") {
    throw new ApiError(
      400,
      `Organization is not pending approval. Current status: ${organization.status}`
    );
  }

  const adminUser = await User.findOne({
    organizationId: orgId,
    role: "npo_admin",
  });
  if (!adminUser)
    throw new ApiError(404, "Admin user for this organization not found");

  if (decision === "approve") {
    organization.status = "active";
    const tempPassword = crypto.randomBytes(8).toString("hex");
    adminUser.password = tempPassword;
    await adminUser.save();

    const emailTemplate = organizationApprovedWithCredentialsTemplate({
      orgName: organization.name,
    });
    sendEmail(
      adminUser.email,
      "Your Organization has been Approved!",
      emailTemplate
    ).catch((err) => console.error(err));
  } else if (decision === "reject") {
    organization.status = "rejected";
    const emailTemplate = organizationRejectedTemplate({
      orgName: organization.name,
    });
    sendEmail(
      adminUser.email,
      "Update on Your Organization Registration",
      emailTemplate
    ).catch((err) => console.error(err));
  }

  await organization.save();
  let notifMessage = "";
  if (decision === "approve") {
    notifMessage = `Congratulations! Your organization, ${organization.name}, has been approved.`;
  } else if (decision === "reject") {
    notifMessage = `An update regarding your registration: your organization, ${organization.name}, has been rejected.`;
  }
  // Create one notification targeted at the NPO
  if (notifMessage) {
    await Notification.create({
      organizationId: orgId,
      message: notifMessage,
    });
  }
  return organization;
};

// This function toggles the block status of an organization.
const setBlockStatus = async (orgId, shouldBeBlocked) => {
  const organization = await Organization.findById(orgId);
  if (!organization) throw new ApiError(404, "Organization not found");

  organization.isBlocked = shouldBeBlocked;
  await organization.save();

  // Send notification email about the change
  const adminUser = await User.findOne({
    organizationId: orgId,
    role: "npo_admin",
  });
  if (adminUser) {
    const orgName = organization.name;
    const loginEmail = organization.email;
    if (shouldBeBlocked) {
      sendEmail(
        adminUser.email,
        "Account Access Update",
        organizationBlockedTemplate({ orgName })
      ).catch((err) => console.error(err));
    } else {
      sendEmail(
        adminUser.email,
        "Your Account Has Been Reactivated",
        organizationUnblockedTemplate({ orgName, loginEmail })
      ).catch((err) => console.error(err));
    }
  }
  await organization.save();

  let notifMessage = "";
  if (shouldBeBlocked) {
    notifMessage = `Your organization's account has been blocked by an administrator.`;
  } else {
    notifMessage = `Your organization's account has been unblocked.`;
  }
  // Create one notification targeted at the NPO
  await Notification.create({
    organizationId: orgId,
    message: notifMessage,
  });
  return organization;
};

const updateOrganization = async (organizationId, updateObj) => {
  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(organizationId, updateObj, { new: true });
    return updatedOrganization;
  } catch (error) {
    throw new Error(`Failed to update organization: ${error.message}`);
  }
};

const getOrgById = async (orgId) => {
    const organization = await Organization.findById(orgId);
    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }
    return organization;
};

module.exports = {
  registerOrganization,
  getAllOrganizations,
  updateOrganizationStatus,
  reviewOrganization,
  setBlockStatus,
  updateOrganization,
  getOrgById
};
