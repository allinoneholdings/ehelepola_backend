// reservationRoutes.js
const express = require('express');
const router = express.Router();
const {createReservation, getTimeSlotsAvailability, getReservation } = require('../controllers/reservationController');

router.post('/add', createReservation);
router.get('/time-slots-availability', getTimeSlotsAvailability);
router.get("/:id", getReservation);

module.exports = router;
