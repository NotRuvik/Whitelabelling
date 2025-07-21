const express = require('express');
const router = express.Router();
const emailTemplatesController = require('../controllers/emailTemplate.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Protect routes for authentication
router.use(protect);

// Email Template Routes
router.route('/')
  .get(emailTemplatesController.getEmailTemplates) // Fetch all templates
  .post(authorize('admin'), emailTemplatesController.createEmailTemplate); // Only admin can create a new template

router.route('/:id')
  .put(authorize('admin'), emailTemplatesController.updateEmailTemplate) // Only admin can update a template
  .delete(authorize('admin'), emailTemplatesController.deleteEmailTemplate); // Only admin can delete a template

module.exports = router;
