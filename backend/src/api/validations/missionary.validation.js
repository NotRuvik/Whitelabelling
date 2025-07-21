// src/api/validations/missionary.validation.js
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMissionarySchema = Joi.object({
  userId: Joi.string().custom(objectId).required(),
  bio: Joi.string().optional().allow(''),
  country: Joi.string().optional().allow(''),
  profilePhotoUrl: Joi.string().uri().optional().allow(''),
  // Add other fields you want to validate on creation
});

module.exports = {
  createMissionarySchema,
};