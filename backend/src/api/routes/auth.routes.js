const express = require('express');
const { login, forgotPassword, resetPassword, googleLogin } = require('../controllers/auth.controller');
const { addOrganization } = require('../controllers/organization.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validations/auth.validation');
const { orgRegistrationSchema } = require('../validations/organization.validation');

const router = express.Router();

// Public route for a new organization to register
// This is effectively the "signup" for a new tenant
router.post('/register', validate(orgRegistrationSchema), addOrganization);

// Public route for any user to log in
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
module.exports = router;