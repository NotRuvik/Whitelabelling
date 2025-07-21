const express = require('express');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getOrganizations, changeOrganizationStatus,reviewOrgDecision, updateBlockStatus, getOrganizationById,listNposForFilter } = require('../controllers/organization.controller');
const router = express.Router();
router.get(
    '/list-all',
    listNposForFilter
);
router.route('/').get(getOrganizations);
//router.route('/:orgId/status').patch(protect, authorize('super_admin'), changeOrganizationStatus);
router.route('/:orgId/status').patch( changeOrganizationStatus);
router.get('/me', protect, authorize('npo_admin'), (req, res) => {
  res.json({ message: `Welcome Admin of Organization ID: ${req.user.organizationId}` });
});
router.post('/:orgId/review', reviewOrgDecision);

// Route for blocking/unblocking an organization
router.patch('/:orgId/block', updateBlockStatus);
router.get('/:orgId', protect, authorize('npo_admin'), getOrganizationById);

module.exports = router;
