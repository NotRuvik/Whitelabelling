const Organization = require('../models/organization.model');
const ApiError = require('../utils/apiError');

/**
 * Middleware to identify a tenant from the x-org-slug header or subdomain.
 * It attaches the tenant's organization object to req.tenant if found.
 */
const identifyTenant = async (req, res, next) => {
  let orgSlug = null;

  // 1. Check for x-org-slug header (case-insensitive)
  if (req.headers['x-org-slug']) {
    orgSlug = req.headers['x-org-slug'].toLowerCase();
  }

  // 2. If not present, extract from subdomain
  if (!orgSlug) {
    const hostname = req.hostname;
    // Define your base domains. Requests to these domains will be ignored.
    const baseDomains = ['localhost', '127.0.0.1', 'your-production-domain.com'];
    const hostParts = hostname.split('.');
    // e.g. npo1.localhost.com => [npo1, localhost, com]
    if (hostParts.length > 2 && !baseDomains.includes(hostParts.slice(1).join('.'))) {
      orgSlug = hostParts[0].toLowerCase();
    } else if (hostParts.length === 2 && !baseDomains.includes(hostParts[1])) {
      // e.g. npo1.lvh.me or npo1.lcl.host
      orgSlug = hostParts[0].toLowerCase();
    }
  }

  if (!orgSlug) {
    // No org context, continue (public route or root domain)
    return next();
  }

  try {
    const organization = await Organization.findOne({ domainSlug: orgSlug, isBlocked: false }).lean();
    if (!organization) {
      return res.status(404).json({ message: `Organization with slug '${orgSlug}' not found or is blocked.` });
    }
    req.tenant = organization;
    next();
  } catch (error) {
    next(new ApiError(500, 'Error identifying tenant.'));
  }
};

module.exports = identifyTenant;