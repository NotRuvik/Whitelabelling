const Organization = require('../models/organization.model');
const ApiError = require('../utils/apiError');

/**
 * Middleware to identify a tenant from the subdomain.
 * It attaches the tenant's organization object to req.tenant if found.
 */
const identifyTenant = async (req, res, next) => {
  const hostname = req.hostname;
  
  // Define your base domains. Requests to these domains will be ignored.
  const baseDomains = ['localhost', 'your-production-domain.com'];

  if (baseDomains.includes(hostname)) {
    return next(); // Not a tenant subdomain, continue normally
  }

  // Subdomain will be the first part of the hostname
  const subdomain = hostname.split('.')[0];

  if (!subdomain) {
    return next(); // No subdomain found
  }

  try {
    const organization = await Organization.findOne({ domainSlug: subdomain, isBlocked: false }).lean();

    if (!organization) {
      // You can either throw an error or just continue without a tenant context.
      // For this case, we'll let it pass, but you could return a 404.
      console.warn(`Tenant with subdomain '${subdomain}' not found.`);
      return next();
    }
    
    // Attach the found tenant to the request object
    req.tenant = organization;
    next();

  } catch (error) {
    next(new ApiError(500, 'Error identifying tenant.'));
  }
};

module.exports = identifyTenant;