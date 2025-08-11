const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Reservations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'schools', key: 'id' },
      onDelete: 'CASCADE',
    },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time_slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'time_slots', key: 'id' },
      onDelete: 'CASCADE',
    },
    student_count: { type: DataTypes.INTEGER, allowNull: false },
    staff_count: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'reservations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
