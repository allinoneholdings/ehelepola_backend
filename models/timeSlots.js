const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('TimeSlots', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    max_capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 250 },
  }, {
    tableName: 'time_slots',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
