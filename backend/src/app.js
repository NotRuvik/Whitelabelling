const express = require("express");
const cors = require("cors");
const routes = require("./api/routes/index"); 
const ApiError = require("./api/utils/apiError");
const identifyTenant = require('./api/middlewares/tenant.middleware');
const webhookRoutes = require('./api/routes/webhook.routes.js');
const app = express();

// 1. Define the list of allowed frontend domains (origins)
const allowedOrigins = [
    'http://localhost:3000',             // Your main NPO/Admin frontend
    'http://ngnpo.localhost.com:3000'   // The new test domain for the missionary landing page
];

// 2. Create the CORS configuration options
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // This allows cookies and authorization headers to be sent
};

// 3. Use the new configuration
app.use(cors(corsOptions));

app.use('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), webhookRoutes);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(identifyTenant);
app.use(express.static('public'));

// API Routes
app.use("/api/v1", routes);

// Handle 404 - Not Found
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "An unexpected error occurred.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
