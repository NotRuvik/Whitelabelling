const express = require("express");
const router = express.Router();
const missionaryController = require("../controllers/missionary.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware");
const createUploader = require("../middlewares/uploader.js");

const profilePhotoUpload = createUploader({
  type: 'single',
  fieldName: 'profilePhoto',
  destination: 'avatars',
  prefix: 'avatar'
})
const verificationDocumentUpload = createUploader({
  type: 'single',
  fieldName: 'verificationDocument',
  destination: 'documents', 
  prefix: 'doc'
});

const pageImageUpload = createUploader({
  type: 'array',
  fieldName: 'pageImages',
  destination: 'page_images',
  prefix: 'page',
  maxCount: 5
});
// --- PUBLIC ROUTE ---
// This route is open to everyone and is used for the "Find a Missionary" page.
// It must be defined BEFORE the `protect` middleware is used.
router.get("/public", missionaryController.getPublicMissionaries);
router.post("/public/signup", missionaryController.publicMissionarySignup);
router.patch(
  "/:missionaryId/assign-base",
  protect,
  authorize("npo_admin"), // Only an admin can assign a base
  missionaryController.assignBaseToMissionary
);
router.get('/list', missionaryController.listPublicMissionaries);
router.use(protect);

// GET all missionaries for the org
router.get(
  "/",
  authorize("npo_admin", "super_admin", "base_user"),
  missionaryController.getMissionariesForMyOrg
);

// POST a new missionary (for NPO Admins)
router.post(
  "/",
  authorize("npo_admin", "base_user"),
  /* validate(addMissionarySchema), */ missionaryController.addAndRegisterMissionary
);

// PATCH to update status (block/unblock)
router.patch(
  "/:missionaryId/status",
  authorize("npo_admin"),
  missionaryController.setMissionaryStatus
);

router
  .route("/me")
  .get(authorize("missionary"), missionaryController.getMyProfile)
  .patch(authorize("missionary"), missionaryController.updateMyProfile);
router.patch(
  "/:missionaryId/status",
  authorize("npo_admin"),
  missionaryController.setMissionaryStatus
);
router.patch(
  "/me/photo",
  authorize("missionary"),
  // upload,
  profilePhotoUpload, 
  missionaryController.uploadProfilePhoto
);
router.patch(
  "/me/images",
  authorize("missionary"),
  pageImageUpload, 
  missionaryController.uploadPageImages
);


// @route   GET /api/missionaries/list
// @desc    Get a list of all missionaries for filtering purposes
// @access  Private (super_admin)
router.get(
    '/list',
    protect,
    authorize('super_admin', 'npo_admin'),
    missionaryController.getMissionaryList
);

module.exports = router;

router.delete(
  '/me/images',
  protect,
  authorize('missionary'),
  missionaryController.deletePageImage 
)

router.patch(
  "/me/document",
  authorize("missionary"),
  verificationDocumentUpload,
  missionaryController.uploadVerificationDocument
);

router.delete(
  "/me/document",
  authorize("missionary"),
  missionaryController.deleteVerificationDocument
);



module.exports = router;
