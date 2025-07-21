const express = require('express');
const { createUser,updateMyAvatar, updateDetails  } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema } = require('../validations/user.validation');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

// IMPORTANT: ALL user management routes should be protected and restricted to super_admins.
//router.use(protect, authorize('super_admin'));

router.post('/', validate(createUserSchema), createUser);
router.patch('/me/avatar', protect, upload, updateMyAvatar);

router.put('/:id', protect,updateDetails);
module.exports = router;