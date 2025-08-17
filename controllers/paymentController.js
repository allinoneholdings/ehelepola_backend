const Stripe = require("stripe");
const { Reservations } = require("../models");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // Fetch reservation from DB
    const reservation = await Reservations.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Calculate amount dynamically (example: $10 per person)
    const totalPeople =
      Number(reservation.student_count) + Number(reservation.staff_count);
    const amount = totalPeople * 10 * 100; // Stripe uses cents

    // Save amount in DB (optional)
    reservation.amount = amount / 100;
    await reservation.save();

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Reservation for ${reservation.school_name}`,
            },
            unit_amount: 1000, // $10 per person
          },
          quantity: totalPeople,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        reservationId: reservation.id,
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

const stripeWebhook = async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Get the reservation
      const reservation = await Reservations.findByPk(session.metadata.reservationId);

      if (reservation) {
        // Send confirmation email
        await sendReservationEmail(reservation.email_address, {
          reservationId: reservation.id,
          schoolName: reservation.school_name,
          contactPerson: reservation.contact_person,
          contactNumber: reservation.contact_number,
          emailAddress: reservation.email_address,
          studentCount: reservation.student_count,
          staffCount: reservation.staff_count,
          date: reservation.date,
          timeSlot: reservation.time_slot_id,
        });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).end();
};
module.exports = { createCheckoutSession,stripeWebhook };
