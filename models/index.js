const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('your_db_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const Schools = require('./schools')(sequelize);
const TimeSlots = require('./timeSlots')(sequelize);
const Reservations = require('./reservations')(sequelize);
const Payments = require('./payments')(sequelize);
const Tickets = require('./tickets')(sequelize);
const Staff = require('./staff')(sequelize);

// Associations
Schools.hasMany(Reservations, { foreignKey: 'school_id', onDelete: 'CASCADE' });
Reservations.belongsTo(Schools, { foreignKey: 'school_id' });

TimeSlots.hasMany(Reservations, { foreignKey: 'time_slot_id', onDelete: 'CASCADE' });
Reservations.belongsTo(TimeSlots, { foreignKey: 'time_slot_id' });

Reservations.hasMany(Payments, { foreignKey: 'reservation_id', onDelete: 'CASCADE' });
Payments.belongsTo(Reservations, { foreignKey: 'reservation_id' });

Reservations.hasMany(Tickets, { foreignKey: 'reservation_id', onDelete: 'CASCADE' });
Tickets.belongsTo(Reservations, { foreignKey: 'reservation_id' });

module.exports = {
  sequelize,
  Schools,
  TimeSlots,
  Reservations,
  Payments,
  Tickets,
  Staff,
};
