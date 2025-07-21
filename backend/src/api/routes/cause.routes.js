const express = require('express');
const router = express.Router();
const causeController = require('../controllers/cause.controller');
const causeUpload = require('../middlewares/causeUpload.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

// This is above `router.use(protect)` to be accessible by the public
router.get('/public', causeController.getPublicCauses);
router.get('/public/:causeId', causeController.getPublicCauseById);

router.use(protect); 
router.get('/', authorize('npo_admin', 'missionary'), causeController.getCausesForMyOrg);

// Only a 'missionary' can create a cause. The 'npo_admin' role is removed.
router.post('/', authorize('missionary'), causeUpload, causeController.createCause);

// NPO Admins and Missionaries can view/update/delete their own org's causes
router.get('/:causeId', authorize('npo_admin', 'missionary'), causeController.getCauseById);
//router.patch('/:causeId', authorize('npo_admin', 'missionary'), causeController.updateCause);
router.patch('/:causeId', authorize('npo_admin', 'missionary'), causeUpload, causeController.updateCause);
router.delete('/:causeId', authorize('npo_admin', 'missionary'), causeController.deleteCause);

module.exports = router;