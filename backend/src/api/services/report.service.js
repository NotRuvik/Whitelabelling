const AbuseReport = require("../models/abuseReport.model");
const User = require("../models/user.model");
const Cause = require("../models/cause.model");
const Missionary = require("../models/missionary.model");
const Notification = require("../models/notification.model");
const { sendEmail } = require("./email.service");
const {
  abuseReportNotificationTemplate,
  userBlockedNotificationTemplate,
  reportDismissedTemplate,
  reporterActionTakenTemplate,
} = require("../utils/emailTemplates");
const ApiError = require("../utils/apiError");

const submitReport = async (reportData) => {
  const {
    reportType,
    reportedMissionary,
    reportedCause,
    abuseType,
    description,
    reporterEmail,
  } = reportData;

  let reportedItem;
  let updatePromise;
  let reportedContentName;

  const newReport = new AbuseReport({
    reporterEmail,
    abuseType,
    description,
    reportType,
  });

  if (reportType === "missionary") {
    if (!reportedMissionary || !reportedMissionary.missionaryId) {
      throw new ApiError(
        400,
        "Missionary details are required for this report."
      );
    }
    reportedItem = await Missionary.findById(
      reportedMissionary.missionaryId
    ).populate("userId", "firstName lastName");
    if (!reportedItem)
      throw new ApiError(404, "Reported missionary not found.");

    newReport.reportedMissionary = reportedItem._id;
    updatePromise = User.updateOne(
      { _id: reportedItem.userId._id },
      { $set: { isReported: true } }
    );
    reportedContentName = `${reportedItem.userId.firstName} ${reportedItem.userId.lastName}`;
  } else if (reportType === "cause") {
    if (!reportedCause || !reportedCause.causeId) {
      throw new ApiError(400, "Cause details are required for this report.");
    }
    reportedItem = await Cause.findById(reportedCause.causeId);
    if (!reportedItem) throw new ApiError(404, "Reported cause not found.");

    newReport.reportedCause = reportedItem._id;
    updatePromise = Cause.updateOne(
      { _id: reportedItem._id },
      { $set: { isReported: true } }
    );
    reportedContentName = reportedItem.name;
  } else {
    throw new ApiError(400, "Invalid report type specified.");
  }

  await Promise.all([newReport.save(), updatePromise]);

  const superAdmins = await User.find({ role: "super_admin" });
  if (superAdmins.length > 0) {
    const notificationMessage = `New abuse report filed for ${reportType}: ${reportedContentName}.`;
    const emailTemplate = abuseReportNotificationTemplate({
      reportType,
      reportedContentName,
      abuseType,
      description,
      reportId: newReport._id,
    });

    const emailPromises = superAdmins.map((admin) =>
      sendEmail(
        admin.email,
        `New Abuse Report: ${reportedContentName}`,
        emailTemplate
      )
    );

    const notificationPromises = superAdmins.map((admin) =>
      Notification.create({
        recipientUserId: admin._id,
        message: notificationMessage,
        url: `/admin/abuse-reports?reportId=${newReport._id}`,
      })
    );

    Promise.all([...emailPromises, ...notificationPromises]).catch((err) =>
      console.error("Failed to send admin notifications:", err)
    );
  }

  return newReport;
};

// /**
//  * Fetches all abuse reports for the admin dashboard.
//  */
// const getAllReports = async () => {
//   return await AbuseReport.find()
//     .populate({
//       path: "reportedMissionary",
//       select: "userId",
//       populate: {
//         path: "userId",
//         select: "firstName lastName email isBlocked",
//       },
//     })
//     .populate({
//       path: "reportedCause",
//       select: "name",
//     })
//     .sort({ createdAt: -1 });
// };
/**
 * Retrieves abuse reports with server-side pagination, sorting, and searching.
 * @param {object} options - Query options.
 * @param {number} options.page - The current page number (1-based).
 * @param {number} options.limit - The number of items per page.
 * @param {string} options.sortBy - The field to sort by.
 * @param {string} options.sortOrder - The sort order ('asc' or 'desc').
 * @param {string} options.search - The search term.
 * @returns {Promise<{data: Array, totalCount: number}>}
 */
const getAllReports = async (options = {}) => {
  // 1. Set defaults for query parameters
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
  } = options;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  // 2. Build the aggregation pipeline
  const pipeline = [
    // Join with missionaries
    {
      $lookup: {
        from: "missionaries",
        localField: "reportedMissionary",
        foreignField: "_id",
        as: "reportedMissionary",
      },
    },
    // Unwind for userId access
    { $unwind: { path: "$reportedMissionary", preserveNullAndEmptyArrays: true } },
    // Join with users
    {
      $lookup: {
        from: "users",
        localField: "reportedMissionary.userId",
        foreignField: "_id",
        as: "reportedMissionary.userId",
      },
    },
    { $unwind: { path: "$reportedMissionary.userId", preserveNullAndEmptyArrays: true } },
    // Join with causes
    {
      $lookup: {
        from: "causes",
        localField: "reportedCause",
        foreignField: "_id",
        as: "reportedCause",
      },
    },
    { $unwind: { path: "$reportedCause", preserveNullAndEmptyArrays: true } },
  ];

  // 3. Add a search stage if a search term is provided
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    pipeline.push({
      $match: {
        $or: [
          { "reportedMissionary.userId.firstName": searchRegex },
          { "reportedMissionary.userId.lastName": searchRegex },
          { "reportedCause.name": searchRegex },
          { abuseType: searchRegex },
          { reporterEmail: searchRegex },
          { reportType: searchRegex },
        ],
      },
    });
  }
  
  // 4. Use $facet to get both total count and paginated data in one query
  const facetStage = {
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $sort: sort }, { $skip: skip }, { $limit: parseInt(limit, 10) }],
    },
  };
  pipeline.push(facetStage);

  // 5. Execute the aggregation
  const result = await AbuseReport.aggregate(pipeline);

  const data = result[0].data;
  const totalCount = result[0].metadata[0] ? result[0].metadata[0].total : 0;
  
  return { data, totalCount };
};

/**
 * Resolves a report by blocking the associated user.
 */
const resolveReportAndBlockUser = async (reportId, adminNotes) => {
  const report = await AbuseReport.findById(reportId).populate({
    path: "reportedMissionary",
    populate: { path: "userId", select: "firstName lastName email" },
  });
  if (!report) throw new ApiError(404, "Abuse report not found.");
  if (report.status !== "pending")
    throw new ApiError(400, "This report has already been resolved.");

  const userToBlock = report.reportedMissionary.userId;
  const reportedContentName = `${userToBlock.firstName} ${userToBlock.lastName}`;

  // 1. Block the user and un-flag them
  await User.updateOne(
    { _id: userToBlock._id },
    { $set: { isBlocked: true, isReported: false } }
  );

  // 2. Update the report status
  report.status = "resolved_blocked";
  report.resolutionNotes = adminNotes;
  await report.save();

  // 3. Email the blocked user with report details
  const blockedUserEmail = userBlockedNotificationTemplate({
    userName: userToBlock.firstName,
    reason: adminNotes,
    reportDetails: report.description, // Include report details
  });
  sendEmail(
    userToBlock.email,
    "An Important Update Regarding Your Account",
    blockedUserEmail
  ).catch((err) => console.error("Failed to send user blocked email:", err));

  // 4. Email the original reporter (if email provided)
  if (report.reporterEmail) {
    const reporterEmailTemplate = reporterActionTakenTemplate({
      reportedContentName,
      reportId: report._id,
    });
    sendEmail(
      report.reporterEmail,
      `Action Taken on Your Report (ID: ${report._id})`,
      reporterEmailTemplate
    ).catch((err) =>
      console.error("Failed to send reporter action-taken email:", err)
    );
  }

  return {
    message: `User ${reportedContentName} has been blocked and the report has been resolved.`,
  };
};

/**
 * Resolves a report by dismissing it.
 * @param {string} reportId - The ID of the abuse report to resolve.
 * @param {string} adminNotes - Notes from the super admin.
 * @returns {Promise<object>}
 */
const resolveReportAndDismiss = async (reportId, adminNotes) => {
  const report = await AbuseReport.findById(reportId)
    .populate({
      path: "reportedMissionary",
      populate: { path: "userId", select: "firstName lastName" },
    })
    .populate("reportedCause", "name");

  if (!report) throw new ApiError(404, "Abuse report not found.");
  if (report.status !== "pending")
    throw new ApiError(400, "This report has already been resolved.");

  let reportedContentName = "";
  // 1. Un-flag the reported content
  if (report.reportType === "missionary" && report.reportedMissionary) {
    await User.updateOne(
      { _id: report.reportedMissionary.userId },
      { $set: { isReported: false } }
    );
    reportedContentName = `${report.reportedMissionary.userId.firstName} ${report.reportedMissionary.userId.lastName}`;
  } else if (report.reportType === "cause" && report.reportedCause) {
    await Cause.updateOne(
      { _id: report.reportedCause._id },
      { $set: { isReported: false } }
    );
    reportedContentName = `the cause "${report.reportedCause.name}"`;
  }

  // 2. Update the report status
  report.status = "resolved_dismissed";
  report.resolutionNotes = adminNotes;
  await report.save();

  // 3. Email the person who reported (if they provided an email)
  if (report.reporterEmail) {
    const emailTemplate = reportDismissedTemplate({
      reportedContentName,
      adminNotes,
    });
    sendEmail(
      report.reporterEmail,
      "Update on Your Recent Report",
      emailTemplate
    ).catch((err) =>
      console.error("Failed to send report dismissal email:", err)
    );
  }

  return { message: `Report has been dismissed.` };
};

/**
 * @param {string} reportId - The ID of the abuse report for a CAUSE.
 * @param {string} adminNotes - Notes from the super admin.
 */
const resolveCauseReportAndBlockMissionary = async (reportId, adminNotes) => {
  const report = await AbuseReport.findById(reportId).populate({
    path: 'reportedCause',
    populate: {
      path: 'missionaryId',
      select: 'userId',
      populate: {
        path: 'userId',
        select: 'firstName lastName email'
      }
    }
  });

  if (!report) throw new ApiError(404, "Abuse report not found.");
  if (report.status !== 'pending') throw new ApiError(400, "This report has already been resolved.");
  if (report.reportType !== 'cause') throw new ApiError(400, "This action is only valid for cause reports.");
  if (!report.reportedCause?.missionaryId?.userId) {
      throw new ApiError(404, "Could not find the missionary associated with the reported cause.");
  }

  const userToBlock = report.reportedCause.missionaryId.userId;
  const reportedContentName = `the cause "${report.reportedCause.name}"`;

  // 1. Block the missionary's user account and un-flag them
  await User.updateOne({ _id: userToBlock._id }, { $set: { isBlocked: true, isReported: false } });

  // 2. Update the report status to 'resolved_blocked'
  report.status = 'resolved_blocked';
  report.resolutionNotes = adminNotes;
  await report.save();

  // 3. Email the blocked missionary
  const blockedUserEmail = userBlockedNotificationTemplate({
    userName: userToBlock.firstName,
    reason: adminNotes,
    reportDetails: `This action was taken in response to a report filed against your cause: "${report.reportedCause.name}".\n\nOriginal report description: ${report.description}`
  });
  sendEmail(userToBlock.email, "An Important Update Regarding Your Account", blockedUserEmail)
    .catch(err => console.error("Failed to send user blocked email for cause report:", err));

  // 4. Email the original reporter
  if (report.reporterEmail) {
    const reporterEmailTemplate = reporterActionTakenTemplate({ reportedContentName, reportId: report._id });
    sendEmail(report.reporterEmail, `Action Taken on Your Report (ID: ${report._id})`, reporterEmailTemplate)
      .catch(err => console.error("Failed to send reporter action-taken email for cause report:", err));
  }

  return { message: `Missionary ${userToBlock.firstName} ${userToBlock.lastName} has been blocked and the report has been resolved.` };
};

module.exports = {
  submitReport,
  getAllReports,
  resolveReportAndBlockUser,
  resolveReportAndDismiss,
  resolveCauseReportAndBlockMissionary
};
