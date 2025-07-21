// src/api/validations/plan.validation.js
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlanSchema = Joi.object({
  name: Joi.string().valid('starter', 'standard', 'premium', 'basic', 'free').required(), 
  priceInCents: Joi.number().integer().min(0).required().description('Price in cents'),
  stripePriceId: Joi.string().required().description('The Price ID from Stripe (price_...)'),
});

const updatePlanSchema = Joi.object({
  priceInCents: Joi.number().integer().min(0), // Also update here
  stripePriceId: Joi.string(),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createPlanSchema,
  updatePlanSchema,
};