require("dotenv").config();
const { sendUserReservationEmail } = require("./utils/mail");

sendUserReservationEmail("pamudithagangana45@gmail.com", {
  reservationId: "123",
  schoolName: "Demo School",
  contactPerson: "Mr Demo",
  contactNumber: "0111234567",
  emailAddress: "learning9241@gmail.com",
  studentCount: 10,
  staffCount: 2,
  date: "2025-09-10",
  timeSlot: "10:00 - 12:00",
  amount: 1000
})
.then(() => console.log("Test email sent ✅"))
.catch(console.error);
