const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Tickets', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'reservations', key: 'id' },
      onDelete: 'CASCADE',
    },
    ticket_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    issued_at: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
