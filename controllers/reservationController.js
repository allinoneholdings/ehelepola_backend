//controllers/reservationController.js
const { TimeSlots, Reservations, sequelize } = require("../models");
async function getTimeSlotsAvailability(req, res) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing 'date' query parameter" });
  }

  try {
    const timeSlots = await TimeSlots.findAll();

    const results = await Promise.all(
      timeSlots.map(async (slot) => {
        const totalReservedResult = await Reservations.findOne({
          attributes: [
            [
              sequelize.fn(
                "SUM",
                sequelize.literal("student_count + staff_count")
              ),
              "totalReserved",
            ],
          ],
          where: {
            date,
            time_slot_id: slot.id,
            status: "confirmed",
          },
          raw: true,
        });

        const reservedCount = totalReservedResult?.totalReserved || 0;
        const availableSpots = Math.max(slot.max_capacity - reservedCount, 0);

        return {
          id: slot.id,
          name: slot.name,
          start_time: slot.start_time,
          end_time: slot.end_time,
          max_capacity: slot.max_capacity,
          reserved_count: reservedCount,
          available_spots: availableSpots,
        };
      })
    );

    return res.json(results);
  } catch (error) {
    console.error("Error fetching time slot availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createReservation = async (req, res) => {
  const {
    date,
    timeSlotId,
    schoolName,
    contactPerson,
    contactNumber,
    emailAddress,
    studentCount,
    staffCount,
  } = req.body;

  try {
    if (
      !date ||
      !timeSlotId ||
      !schoolName ||
      !contactPerson ||
      !contactNumber ||
      !emailAddress ||
      studentCount == null ||
      staffCount == null
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const slot = await TimeSlots.findByPk(timeSlotId);
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    const reservedResult = await Reservations.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("student_count")), "reservedCount"],
        [
          sequelize.fn("SUM", sequelize.col("staff_count")),
          "reservedStaffCount",
        ],
      ],
      where: {
        date,
        time_slot_id: timeSlotId,
        status: "confirmed",
      },
      raw: true,
    });

    const reservedStudents = Number(reservedResult?.reservedCount) || 0;
    const reservedStaff = Number(reservedResult?.reservedStaffCount) || 0;
    const totalReserved = reservedStudents + reservedStaff;
    const totalRequested = Number(studentCount) + Number(staffCount);

    if (totalReserved + totalRequested > slot.max_capacity) {
      return res.status(400).json({ message: "Not enough available spots" });
    }

    const PRICE_PER_PERSON = 100;
    const amount = Number(studentCount) * PRICE_PER_PERSON;


    const reservation = await Reservations.create({
      date,
      time_slot_id: timeSlotId,
      student_count: studentCount,
      staff_count: staffCount,
      school_name: schoolName,
      contact_person: contactPerson,
      contact_number: contactNumber,
      email_address: emailAddress,
      amount,
      status: "confirmed",
    });

    res.status(201).json({ message: "Reservation successful", reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    if (!status || !["visited", "cancelled"].includes(status.toLowerCase())) {
      return res.status(400).json({
        message:
          "Status is required and must be either 'visited' or 'cancelled'",
      });
    }

    const reservation = await Reservations.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = status.toLowerCase();
    await reservation.save();

    res.json({
      message: "Reservation status updated successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.findAll({
      include: [
        {
          model: TimeSlots,
          attributes: ["name", "start_time", "end_time"],
        },
      ],
    });

    res.json(
      reservations.map((r) => ({
        reservationId: r.id,
        schoolName: r.school_name,
        contactPerson: r.contact_person,
        contactNumber: r.contact_number,
        emailAddress: r.email_address,
        studentCount: r.student_count,
        staffCount: r.staff_count,
        date: r.date,
        timeSlot: `${r.TimeSlot.start_time} - ${r.TimeSlot.end_time}`,
        status: r.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReservation = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Reservation ID is required" });
  }

  try {
    const reservation = await Reservations.findByPk(id, {
      include: [
        {
          model: TimeSlots,
          attributes: ["name", "start_time", "end_time"],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Send formatted response for frontend ticket
    res.json({
      reservationId: reservation.id,
      schoolName: reservation.school_name,
      contactPerson: reservation.contact_person,
      contactNumber: reservation.contact_number,
      emailAddress: reservation.email_address,
      studentCount: reservation.student_count,
      staffCount: reservation.staff_count,
      date: reservation.date,
      timeSlot: `${reservation.TimeSlot.start_time} - ${reservation.TimeSlot.end_time}`,
      status: reservation.status,
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTodayReservations = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const reservations = await Reservations.findAll({
      where: { date: today },
      include: [
        {
          model: TimeSlots,
          attributes: ["name", "start_time", "end_time"],
        },
      ],
    });

    res.json(
      reservations.map((r) => ({
        reservationId: r.id,
        schoolName: r.school_name,
        contactPerson: r.contact_person,
        contactNumber: r.contact_number,
        emailAddress: r.email_address,
        studentCount: r.student_count,
        staffCount: r.staff_count,
        date: r.date,
        timeSlot: `${r.TimeSlot.start_time} - ${r.TimeSlot.end_time}`,
        status: r.status,
      }))
    );
  } catch (error) {
    console.error("Error fetching today's reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTimeSlotsAvailability,
  createReservation,
  getReservation,
  getAllReservations,
  updateReservationStatus,
  getTodayReservations,
};
