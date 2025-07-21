// src/api/routes/index.js
const express = require("express");
const authRoutes = require("./auth.routes");
const orgRoutes = require("./organization.routes");
const planRoutes = require("./plan.routes");
const causeRoutes = require("./cause.routes");
const missionaryRoutes = require("./missionary.routes");
const userRoutes = require("./user.routes");
const router = express.Router();
const notificationRoutes = require("./notification.routes");
const baseRoutes = require("./base.routes");
const donationRoutes = require("./donation.routes");
const donorRoutes = require("./donor.routes");
const emailTemplates = require("./emailTemplate.routes");
const reportRoutes = require("./report.routes");
const paymentRoutes = require("./payment.routes");
const stripeRoutes = require("./stripe.routes");
const dashboardRoutes = require("./dashboard.routes");
const defaultRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/organizations", route: orgRoutes },
  { path: "/plans", route: planRoutes },
  { path: "/causes", route: causeRoutes },
  { path: "/missionaries", route: missionaryRoutes },
  { path: "/users", route: userRoutes },
  { path: "/notifications", route: notificationRoutes },
  { path: "/bases", route: baseRoutes },
  { path: "/emailTemplates", route: emailTemplates },
  { path: "/donations", route: donationRoutes },
   { path: "/donors", route: donorRoutes },
  { path: "/reports", route: reportRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/stripe", route: stripeRoutes },
  { path: "/dashboard", route: dashboardRoutes },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;