const organizationService = require("../services/organization.service");
const ApiResponse = require("../utils/apiResponse");
const Organization = require("../models/organization.model");
const addOrganization = async (req, res, next) => {
  try {
    const newOrg = await organizationService.registerOrganization(req.body);
    res
      .status(201)
      .json(
        new ApiResponse(201, newOrg, "Organization registered successfully!")
      );
  } catch (error) {
    next(error);
  }
};

const getOrganizations = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, search = '', sortField = "", sortOrder = "asc", ...filter } = req.query;
    const organizations = await organizationService.getAllOrganizations({
      page: Number(page),
      perPage: Number(perPage),
      search,
    });
    res.status(200).json(new ApiResponse(200, organizations));
  } catch (error) {
    next(error);
  }
};

const listNposForFilter = async (req, res, next) => {
    try {
        const npos = await Organization.find().select('name').sort({ name: 1 }).lean();
        res.status(200).json(new ApiResponse(200, npos, "NPO list fetched successfully."));
    } catch (error) {
        next(error);
    }
};
const changeOrganizationStatus = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { status } = req.body;
    const updatedOrg = await organizationService.updateOrganizationStatus(
      orgId,
      status
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedOrg,
          `Organization status updated to ${status}`
        )
      );
  } catch (error) {
    next(error);
  }
};
const reviewOrgDecision = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { decision } = req.body; // 'approve' or 'reject'
    const updatedOrg = await organizationService.reviewOrganization(
      orgId,
      decision
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedOrg, `Organization has been ${decision}d.`)
      );
  } catch (error) {
    next(error);
  }
};

const updateBlockStatus = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { isBlocked } = req.body; // true or false
    const updatedOrg = await organizationService.setBlockStatus(
      orgId,
      isBlocked
    );
    const action = isBlocked ? "blocked" : "unblocked";
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedOrg, `Organization has been ${action}.`)
      );
  } catch (error) {
    next(error);
  }
};

const getOrganizationById = async (req, res, next) => {
  try {
    const { orgId } = req.params;

    // Security check: Ensure the logged-in user belongs to the org they are requesting
    if (req.user.organizationId.toString() !== orgId) {
      throw new ApiError(
        403,
        "Forbidden: You do not have permission to access this resource."
      );
    }

    const organization = await organizationService.getOrgById(orgId);
    res
      .status(200)
      .json(
        new ApiResponse(200, organization, "Organization fetched successfully")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrganization,
  getOrganizations,
  changeOrganizationStatus,
  reviewOrgDecision,
  updateBlockStatus,
  getOrganizationById,
  listNposForFilter
};
