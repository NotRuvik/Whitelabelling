exports.organizationRegistrationTemplate = (data) => {
  return `
      <h2>Welcome to Night Bright, ${data.name}!</h2>
      <p>Your organization has been successfully registered on our platform.</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Domain Slug:</strong> ${data.domainSlug}</p>
      <p><strong>Plan:</strong> ${data.planType}</p>
      <p><strong>Initial Payment:</strong> $${(data.price / 100).toFixed(2)}</p>
      <p>Status: <strong>Active & Approved</strong></p>
      <p>Thank you for joining us. You can now log in and start setting up your missionaries and causes.</p>
    `;
};

const adminNotificationTemplate = (data) => {
  return `
      <h2>New Organization Registration!</h2>
      <p>A new organization has been successfully registered and payment has been processed.</p>
      <p><strong>Organization Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Domain:</strong> ${data.domainSlug}</p>
      <p><strong>Plan Type:</strong> ${data.planType}</p>
      <p><strong>Plan Price:</strong> $${(data.price / 100).toFixed(2)}</p>
      <p><strong>Payment Status:</strong> Successful</p>
      <p><strong>Payment Intent ID:</strong> ${data.paymentIntentId}</p>
    `;
};

const organizationApprovedWithCredentialsTemplate = ({
  orgName,
  loginEmail,
  tempPassword,
}) => `
  <h1>Congratulations, ${orgName}!</h1>
  <p>Your organization has been approved.</p>
  <p>You can now log in to your dashboard using the following credentials:</p>
  <ul>
    <li><strong>Email:</strong> ${loginEmail}</li>
    <li><strong>Temporary Password:</strong> ${tempPassword}</li>
  </ul>
  <p>We strongly recommend changing your password immediately after your first login.</p>
`;
const organizationBlockedTemplate = ({ orgName }) => `
  <h1>Notice: ${orgName}</h1>
  <p>Your organization account has been <strong>blocked</strong>.</p>
  <p>This action was taken due to a violation of our platform policies or pending verification.</p>
  <p>If you believe this was a mistake or have any questions, please contact our support team.</p>
`;

const organizationUnblockedTemplate = ({ orgName, loginEmail }) => `
  <h1>Good News, ${orgName}!</h1>
  <p>Your organization account has been <strong>unblocked</strong> and access has been restored.</p>
  <p>You may log in again using your registered email:</p>
  <ul>
    <li><strong>Email:</strong> ${loginEmail}</li>
  </ul>
  <p>Welcome back! Let us know if you need any assistance.</p>
`;

const organizationRejectedTemplate = ({ orgName }) => `
  <h1>Update on Your Application - ${orgName}</h1>
  <p>We regret to inform you that your organization’s registration request has been <strong>rejected</strong>.</p>
  <p>This decision was made after reviewing the details provided. Unfortunately, your organization did not meet one or more of our platform’s approval criteria.</p>
  <p>If you believe this was a mistake or if you'd like to appeal or reapply, please reach out to our support team for further clarification.</p>
  <p>We appreciate your interest in joining our platform.</p>
`;
const missionaryWelcomeWithCredentialsTemplate = ({
  missionaryName,
  npoName,
  loginEmail,
  tempPassword,
}) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
      .header { background-color: #f4f4f4; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { padding: 20px; }
      .credentials { background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px; }
      strong { color: #0056b3; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome Aboard!</h2>
      </div>
      <div class="content">
        <p>Hello ${missionaryName},</p>
        <p>You have been registered as a new missionary with <strong>${npoName}</strong>.</p>
        <p>You can now log in to the platform using the following credentials. We strongly recommend you change your password after your first login.</p>
        <div class="credentials">
          <p><strong>Login Email:</strong> ${loginEmail}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p>We're excited to have you with us!</p>
      </div>
    </div>
  </body>
  </html>
`;

/**
 * Generates the HTML for a welcome email to a new Base User.
 * @param {object} data - { baseUserName, npoName, loginEmail, tempPassword }
 */
const baseUserWelcomeWithCredentialsTemplate = (data) => {
  const { baseUserName, npoName, loginEmail, tempPassword } = data;
  // You can get your app's login URL from environment variables
  const loginUrl = process.env.APP_LOGIN_URL || "http://localhost:3000/login";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to ${npoName}!</h2>
      <p>Hello ${baseUserName},</p>
      <p>An administrator has created a Base Manager account for you for the organization: <strong>${npoName}</strong>.</p>
      <p>You can now log in to manage missionaries for your base location. Please use the following temporary credentials to access your account. You will be prompted to change your password upon your first login.</p>
      <div style="background-color: #f2f2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
        <p><strong>Email:</strong> ${loginEmail}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p>Thank you,</p>
      <p>The Team</p>
    </div>
  `;
};

const donorWelcomeWithCredentialsTemplate = ({
  donorName,
  loginEmail,
  tempPassword,
}) => {
  // A professional brand color, consistent with your UI
  const themeColor = "#C09355";
  const loginUrl = `${process.env.FRONTEND_URL}/login`; // Make sure your frontend URL is in your .env file

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: ${themeColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; }
            .credentials { background-color: #f9f8f8; padding: 15px; border-radius: 8px; margin-top: 20px; }
            strong { color: #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to Night Bright!</h2>
            </div>
            <p>Hi ${donorName},</p>
            <p>Thank you for your generous donation! To help you keep track of your contributions and connect with the causes you support, a donor account has been created for you.</p>
            
            <div class="credentials">
                <p>You can log in to your dashboard using these credentials:</p>
                <p><strong>Email:</strong> ${loginEmail}</p>
                <p><strong>Temporary Password:</strong> <strong>${tempPassword}</strong></p>
                <p><em>For your security, we highly recommend changing your password after your first login.</em></p>
            </div>

            <p style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
            </p>

            <p>We are thrilled to have you as part of our community, helping to make a difference worldwide.</p>
            <p>Sincerely,<br>The Night Bright Team</p>
        </div>
    </body>
    </html>
    `;
};

/**
 * Notifies super admins about a new abuse report.
 * @param {object} data - { reportType, reportedContentName, abuseType, description, reportId }
 */
const abuseReportNotificationTemplate = (data) => {
  const { reportType, reportedContentName, abuseType, description, reportId } =
    data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #d9534f; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.9em; color: #777; margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        strong { color: #d9534f; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>New Abuse Report Filed</h2></div>
        <div class="content">
          <p>Hello Admin,</p>
          <p>A new abuse report has been submitted and requires your attention.</p>
          <h3>Report Details:</h3>
          <ul>
            <li><strong>Report Type:</strong> ${reportType}</li>
            <li><strong>Reported Content:</strong> ${reportedContentName}</li>
            <li><strong>Reason:</strong> ${abuseType}</li>
            <li><strong>Description:</strong></li>
            <p><em>${description}</em></p>
          </ul>
          <p>Please log in to the admin dashboard to review the report and take appropriate action.</p>
          <a href="${process.env.FRONTEND_URL}/admin/abuse-reports?reportId=${reportId}" class="button">View Report</a>
        </div>
        <div class="footer">Night Bright Platform</div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Informs a user that their account has been blocked.
 * @param {object} data - { userName, reason }
 */
const userBlockedNotificationTemplate = (data) => {
  const { userName, reason } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #f0ad4e; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.9em; color: #777; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>Account Access Update</h2></div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>This email is to inform you that your account has been blocked due to a violation of our community guidelines. An administrator has reviewed a report and taken this action based on the following reason:</p>
          <p><strong>Admin Notes:</strong> <em>${reason}</em></p>
          <p>If you believe this was a mistake, please contact our support team.</p>
        </div>
        <div class="footer">Night Bright Platform</div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Informs a reporter that their report has been reviewed and dismissed.
 * @param {object} data - { reportedContentName, adminNotes }
 */
const reportDismissedTemplate = (data) => {
  const { reportedContentName, adminNotes } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #5cb85c; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.9em; color: #777; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>Update on Your Recent Report</h2></div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for helping us keep our community safe. We have reviewed your recent report regarding <strong>${reportedContentName}</strong>.</p>
          <p>After careful consideration, our team has concluded that the reported content does not violate our community guidelines at this time. The report has been dismissed.</p>
          <p><strong>Admin Notes:</strong> <em>${adminNotes}</em></p>
          <p>We appreciate you taking the time to submit your report. Your vigilance is valuable to us.</p>
        </div>
        <div class="footer">Night Bright Platform</div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Informs a reporter that action was taken based on their report.
 * @param {object} data - { reportedContentName, reportId }
 */
const reporterActionTakenTemplate = (data) => {
  const { reportedContentName, reportId } = data;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #007bff; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 0.9em; color: #777; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>Update on Your Report (ID: ${reportId})</h2></div>
        <div class="content">
          <p>Hello,</p>
          <p>This is an update regarding your recent report concerning <strong>${reportedContentName}</strong>.</p>
          <p>Our team has reviewed the report and has taken appropriate action in accordance with our community guidelines.</p>
          <p>Thank you for helping us maintain a safe and respectful environment for everyone. Your contribution is greatly appreciated.</p>
        </div>
        <div class="footer">Night Bright Platform</div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  organizationApprovedWithCredentialsTemplate,
  organizationRejectedTemplate,
  organizationUnblockedTemplate,
  organizationBlockedTemplate,
  adminNotificationTemplate,
  missionaryWelcomeWithCredentialsTemplate,
  baseUserWelcomeWithCredentialsTemplate,
  donorWelcomeWithCredentialsTemplate,
  abuseReportNotificationTemplate,
  userBlockedNotificationTemplate,
  reportDismissedTemplate,
  reporterActionTakenTemplate
};
