const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load .env file from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define a schema for environment variables for validation
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string().default('7d').description('JWT expiry'),
    STRIPE_SECRET_KEY: Joi.string().required().description('Stripe Secret Key'),
    ADMIN_EMAIL: Joi.string().email().required().description('Admin email for notifications'),
    ADMIN_EMAIL_PASSWORD: Joi.string().required().description('Password for admin email'),
  })
  .unknown(); // Allow other env variables not defined in the schema

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  stripe: {
    secretKey: envVars.STRIPE_SECRET_KEY,
  },
  email: {
    adminEmail: envVars.ADMIN_EMAIL,
    adminPassword: envVars.ADMIN_EMAIL_PASSWORD,
  },
};