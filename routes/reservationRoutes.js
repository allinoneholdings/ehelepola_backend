// reservationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createReservation,
  getTimeSlotsAvailability,
  getReservation,
  getAllReservations,
  updateReservationStatus,
  getTodayReservations,
} = require("../controllers/reservationController");

router.post("/add", createReservation);
router.get("/time-slots-availability", getTimeSlotsAvailability);
router.get("/all", getAllReservations);
router.get("/today", getTodayReservations);
router.get("/:id", getReservation);
router.patch("/reservations/:id/status", updateReservationStatus);

module.exports = router;
