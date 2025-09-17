// server.js
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentController = require("./controllers/paymentController");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Test database
app.get("/staff", (req, res) => {
  db.query("SELECT * FROM staff", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.post(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

app.use(express.json());
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log("Stripe key prefix:", process.env.STRIPE_SECRET_KEY?.slice(0, 7));
