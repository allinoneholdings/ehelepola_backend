//controllers/paymentController.js
const Stripe = require("stripe");
const { Reservations } = require("../models");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const {
  sendUserReservationEmail,
  sendAdminReservationEmail,
} = require("../utils/mail");

//Chechout function
const createCheckoutSession = async (req, res) => {
  const { reservationId } = req.body;

  const reservation = await Reservations.findByPk(reservationId);
  if (!reservation)
    return res.status(404).json({ error: "Reservation not found" });

  const unitPrice = 100 * 100;
  const totalAmount = reservation.student_count * unitPrice;
  reservation.amount = totalAmount / 100;
  await reservation.save();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: reservation.email_address,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Reservation for ${reservation.school_name}` },
          unit_amount: unitPrice,
        },
        quantity: reservation.student_count,
      },
    ],
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
    metadata: { reservationId: reservation.id },
  });

  res.json({ sessionUrl: session.url });
};


const stripeWebhook = async (req, res) => {
  try {
    const event = req.body;

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        const reservation = await Reservations.findByPk(
          session.metadata.reservationId
        );

        if (reservation) {
          const reservationData = {
            reservationId: reservation.id,
            schoolName: reservation.school_name,
            contactPerson: reservation.contact_person,
            contactNumber: reservation.contact_number,
            emailAddress: reservation.email_address,
            studentCount: reservation.student_count,
            staffCount: reservation.staff_count,
            date: reservation.date,
            timeSlot: reservation.time_slot_id,
            amount: reservation.amount,
          };

          await sendUserReservationEmail(
            reservation.email_address,
            reservationData
          );

          await sendAdminReservationEmail(
            process.env.ADMIN_EMAIL,
            reservationData
          );
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).end();
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(500).send("Webhook error");
  }
};

module.exports = { createCheckoutSession, stripeWebhook };
