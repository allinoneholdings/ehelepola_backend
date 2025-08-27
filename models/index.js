const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("ehelepola_walawwa", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const TimeSlots = require("./timeSlots")(sequelize);
const Reservations = require("./reservations")(sequelize);
const Staff = require("./staff")(sequelize);

TimeSlots.hasMany(Reservations, {
  foreignKey: "time_slot_id",
  onDelete: "CASCADE",
});
Reservations.belongsTo(TimeSlots, { foreignKey: "time_slot_id" });

module.exports = {
  sequelize,
  TimeSlots,
  Reservations,
  Staff,
};
