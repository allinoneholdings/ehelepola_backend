// server.js
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();

const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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

app.use(express.json());
app.use("/api/reservations", reservationRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log("Stripe key prefix:", process.env.STRIPE_SECRET_KEY?.slice(0, 7));
