const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReservationEmail(to, subject, reservationData) {
  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reservation Ticket</title>
  <style>
    body {
      font-family: "Georgia", serif;
      background: #f5f0e6;
      margin: 0;
      padding: 20px;
    }
    .ticket {
      max-width: 600px;
      margin: auto;
      background: #fff8f0;
      border: 3px solid #a67c52;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      position: relative;
    }
    .ticket::before, .ticket::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      background: #f5f0e6;
      border: 3px solid #a67c52;
      border-radius: 50%;
    }
    .ticket::before {
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
    }
    .ticket::after {
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
    }
    h2 {
      text-align: center;
      font-size: 26px;
      color: #5a3e2b;
      margin-bottom: 20px;
      border-bottom: 2px solid #a67c52;
      padding-bottom: 10px;
    }
    p {
      font-size: 16px;
      color: #3a2c1e;
      margin: 8px 0;
    }
    strong {
      color: #5a3e2b;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-style: italic;
      color: #7a5c44;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="ticket">
    <h2>🎟️ Reservation Confirmation</h2>
    <p><strong>Reservation ID:</strong> ${reservationData.reservationId}</p>
    <p><strong>School Name:</strong> ${reservationData.schoolName}</p>
    <p><strong>Contact Person:</strong> ${reservationData.contactPerson}</p>
    <p><strong>Contact Number:</strong> ${reservationData.contactNumber}</p>
    <p><strong>Email:</strong> ${reservationData.emailAddress}</p>
    <p><strong>Students:</strong> ${reservationData.studentCount}</p>
    <p><strong>Staff:</strong> ${reservationData.staffCount}</p>
    <p><strong>Date:</strong> ${reservationData.date}</p>
    <p><strong>Time Slot:</strong> ${reservationData.timeSlot}</p>
    <p><strong>Total Amount:</strong> <span style="color:#a67c52; font-weight:bold;">LKR ${reservationData.amount}</span></p>
    <div class="footer">
      Present this ticket at the entrance of the historical site 🏛️<br>
      Thank you for preserving history with us.
    </div>
  </div>
</body>
</html>

  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  });
}

module.exports = { sendReservationEmail };
