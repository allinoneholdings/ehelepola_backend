//utils/mail.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("Email transporter ready ✅");
});


async function sendUserReservationEmail(to, reservationData) {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f2ee; padding: 30px; text-align:center;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border:2px solid #a67c52;
        border-radius:20px; padding:30px; box-shadow:0 8px 24px rgba(0,0,0,0.12); text-align:left;">
        <h2 style="color:#4a3222; font-size:28px; margin-bottom:10px; text-align:center;">
          Reservation Confirmation
        </h2>
        <p style="color:#555; font-size:15px; margin-bottom:25px; text-align:center; line-height:1.6;">
          We are delighted to confirm your reservation at <strong>Ehelepolawalawwa</strong>.  
          Please review your booking details below:
        </p>
        <div style="background:#faf8f5; border:1px solid #e0d6c8; border-radius:12px; padding:20px; margin-bottom:25px;">
          <p style="margin:8px 0;"><strong>Reservation ID:</strong> ${
            reservationData.reservationId
          }</p>
          <p style="margin:8px 0;"><strong>School:</strong> ${
            reservationData.schoolName
          }</p>
          <p style="margin:8px 0;"><strong>Contact Person:</strong> ${
            reservationData.contactPerson
          }</p>
          <p style="margin:8px 0;"><strong>Date:</strong> ${
            reservationData.date
          }</p>
          <p style="margin:8px 0;"><strong>Time Slot:</strong> ${
            reservationData.timeSlot
          }</p>
          <p style="margin:8px 0;"><strong>Number of Students:</strong> ${
            reservationData.studentCount
          }</p>
          <p style="margin:8px 0;"><strong>Number of Staff:</strong> ${
            reservationData.staffCount
          }</p>
          <hr style="border:none; border-top:1px solid #a67c52; margin:15px 0;">
          <p style="font-size:18px; font-weight:bold; color:#a67c52; text-align:center; margin:0;">
            Total Amount: LKR ${reservationData.amount}
          </p>
        </div>
        <div style="text-align:center; margin-bottom:20px;">
          <img src="https://assets.ehelepolawalawwa.lk/assets/assets/logos/ehelepola-walauwwe-logo-black.webp" 
            alt="Ehelepolawalawwa Logo" 
            style="max-width:140px; border-radius:8px; margin-bottom:15px;" />
          <div style="font-size:14px; color:#7a5c44; font-style:italic; line-height:1.5;">
            Please present this confirmation at the entrance. <br>
            Thank you for preserving history with us.
          </div>
        </div>
        <p style="margin-top:25px; font-size:12px; color:#888; text-align:center;">
          © ${new Date().getFullYear()} Ehelepolawalawwa. All rights reserved.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Reservation is Confirmed 🎉",
      html: htmlContent,
    });
    console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
  }
}

//Admin info layout

async function sendAdminReservationEmail(to, reservationData) {
  const htmlContent = `
  <div style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px">
    <div style="max-width:700px;margin:auto;background:#fff;border:1px solid #ddd;padding:20px;">
      <h2 style="color:#333;">📌 New Reservation Made</h2>
      <p>A new reservation has been completed via Stripe Checkout.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;">
        <tr><td><strong>Reservation ID:</strong></td><td>${reservationData.reservationId}</td></tr>
        <tr><td><strong>School Name:</strong></td><td>${reservationData.schoolName}</td></tr>
        <tr><td><strong>Contact Person:</strong></td><td>${reservationData.contactPerson}</td></tr>
        <tr><td><strong>Contact Number:</strong></td><td>${reservationData.contactNumber}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${reservationData.emailAddress}</td></tr>
        <tr><td><strong>Students:</strong></td><td>${reservationData.studentCount}</td></tr>
        <tr><td><strong>Staff:</strong></td><td>${reservationData.staffCount}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${reservationData.date}</td></tr>
        <tr><td><strong>Time Slot:</strong></td><td>${reservationData.timeSlot}</td></tr>
        <tr><td><strong>Amount:</strong></td><td>LKR ${reservationData.amount}</td></tr>
      </table>
    </div>
  </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "New Reservation Alert 🚨",
      html: htmlContent,
    });
    console.log(`✅ Admin email sent to ${to}, messageId: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send admin email to ${to}:`, err);
  }
}


module.exports = {
  sendUserReservationEmail,
  sendAdminReservationEmail,
};
