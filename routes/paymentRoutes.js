//routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createCheckoutSession,stripeWebhook  } = require("../controllers/paymentController");

router.post("/create-checkout-session", createCheckoutSession);
module.exports = router;
