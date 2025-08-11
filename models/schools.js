const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Schools', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    contact_person: { type: DataTypes.STRING(255), allowNull: false },
    NIC: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    tel: { type: DataTypes.STRING(20), allowNull: false },
  }, {
    tableName: 'schools',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
