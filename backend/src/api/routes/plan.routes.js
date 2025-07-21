const express = require('express');
const { createPlan, getActivePlans, getAllPlans, getPlanById, updatePlan, deletePlan } = require('../controllers/plan.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createPlanSchema, updatePlanSchema } = require('../validations/plan.validation');
const { objectId } = require('../validations/custom.validation');
const Joi = require('joi');

const router = express.Router();

router.get('/', getActivePlans); // Anyone can see active plans
router.get(
    '/:planId',
    validate(Joi.object({ planId: Joi.string().custom(objectId) })),
    getPlanById
);

// --- Super Admin Only Routes ---
router.use(protect, authorize('super_admin')); // All routes below this require super_admin login

router.post('/', validate(createPlanSchema), createPlan);
router.get('/all', getAllPlans); // Special route for admin to see all plans
router
    .route('/:planId')
    .patch(
        validate(Joi.object({ planId: Joi.string().custom(objectId) })),
        validate(updatePlanSchema),
        updatePlan
    )
    .delete(
        validate(Joi.object({ planId: Joi.string().custom(objectId) })),
        deletePlan
    );

module.exports = router;