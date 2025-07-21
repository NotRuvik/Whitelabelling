// src/api/validations/organization.validation.js
const Joi = require('joi');

const orgRegistrationSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  firstName: Joi.string().trim().required().label("Admin First Name"),
  lastName: Joi.string().trim().required().label("Admin Last Name"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).allow(''),
  domainSlug: Joi.string().trim().alphanum().min(3).required(),
  logoUrl: Joi.string().uri().optional().allow(''),
  backgroundColor: Joi.string().optional().allow(''),
  planType: Joi.string().valid('starter', 'premium', 'standard').required(),
  paymentMethodId: Joi.string().required(),
});

module.exports = {
  orgRegistrationSchema
};