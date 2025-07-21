const EmailTemplateService = require('../services/emailTemplate.service');
const ApiError = require('../utils/apiError');

// Get all email templates
exports.getEmailTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplateService.getAllEmailTemplates();
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

// Create a new email template
exports.createEmailTemplate = async (req, res, next) => {
  const { type, subject, body, isDefault = false } = req.body;

  try {
    const newTemplate = await EmailTemplateService.createEmailTemplate({
      type,
      subject,
      body,
      isDefault,
      createdBy: req.user._id, // Assuming the user is authenticated
    });

    res.status(201).json({
      success: true,
      data: newTemplate,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

// Update an email template
exports.updateEmailTemplate = async (req, res, next) => {
  const { id } = req.params;
  const { type, subject, body, isDefault } = req.body;

  try {
    const updatedTemplate = await EmailTemplateService.updateEmailTemplate(id, {
      type,
      subject,
      body,
      isDefault,
    });

    res.status(200).json({
      success: true,
      data: updatedTemplate,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

// Delete an email template
exports.deleteEmailTemplate = async (req, res, next) => {
  const { id } = req.params;

  try {
    const message = await EmailTemplateService.deleteEmailTemplate(id);
    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};
