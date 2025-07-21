const EmailTemplate = require('../models/emailTemplate.model');

// Get all email templates
exports.getAllEmailTemplates = async () => {
  try {
    const templates = await EmailTemplate.find();
    return templates;
  } catch (error) {
    throw new Error('Failed to fetch email templates');
  }
};

// Create a new email template
exports.createEmailTemplate = async (data) => {
  const { type, subject, body, isDefault, createdBy } = data;

  try {
    const newTemplate = await EmailTemplate.create({
      type,
      subject,
      body,
      isDefault,
      createdBy,
    });
    return newTemplate;
  } catch (error) {
    throw new Error('Failed to create email template');
  }
};

// Update an existing email template
exports.updateEmailTemplate = async (id, data) => {
  try {
    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedTemplate) {
      throw new Error('Template not found');
    }

    return updatedTemplate;
  } catch (error) {
    throw new Error('Failed to update email template');
  }
};

// Delete an email template
exports.deleteEmailTemplate = async (id) => {
  try {
    const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      throw new Error('Template not found');
    }

    return 'Template deleted successfully';
  } catch (error) {
    throw new Error('Failed to delete email template');
  }
};
