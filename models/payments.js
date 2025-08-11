const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Payments', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'reservations', key: 'id' },
      onDelete: 'CASCADE',
    },
    payment_method: { type: DataTypes.STRING(50), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    transaction_id: { type: DataTypes.STRING(255) },
    paid_at: { type: DataTypes.DATE },
  }, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
