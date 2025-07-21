// src/api/validations/cause.validation.js
const Joi = require('joi');
const { objectId } = require('./custom.validation'); // We'll create this helper

const createCauseSchema = Joi.object({
  name: Joi.string().required().min(3),
  description: Joi.string().optional().allow(''),
  missionaryId: Joi.string().custom(objectId).required(),
  goalAmount: Joi.number().min(1).required(),
  deadline: Joi.date().iso().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

const updateCauseSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().optional().allow(''),
  goalAmount: Joi.number().min(1),
  deadline: Joi.date().iso().optional(),
  images: Joi.array().items(Joi.string().uri()),
  isCompleted: Joi.boolean(),
  isActive: Joi.boolean(),
}).min(1); // At least one field must be updated

module.exports = {
  createCauseSchema,
  updateCauseSchema,
};