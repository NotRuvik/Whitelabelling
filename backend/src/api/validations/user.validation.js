// src/api/validations/user.validation.js
const Joi = require('joi');

const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('super_admin', 'npo_admin', 'missionary', 'donor').required(),
  // For creating an npo_admin/missionary this way, you'd also pass an organizationId
  organizationId: Joi.string().optional().allow(null, ''), 
});

module.exports = {
  createUserSchema,
};