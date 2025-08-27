//models/reservation.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Reservations",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time_slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "time_slots", key: "id" },
        onDelete: "CASCADE",
      },
      student_count: { type: DataTypes.INTEGER, allowNull: false },
      staff_count: { type: DataTypes.INTEGER, allowNull: false },
      school_name: { type: DataTypes.STRING, allowNull: false },
      contact_person: { type: DataTypes.STRING, allowNull: false },
      contact_number: { type: DataTypes.STRING, allowNull: false },
      email_address: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "visited", "cancelled"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "reservations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
