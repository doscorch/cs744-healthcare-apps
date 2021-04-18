const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Medicine = sequelize.define('Medicine', {
    medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    medicine_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medical_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    commercial_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medicine_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recommended_dosage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vendor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cost: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'medicines'
});

module.exports = Medicine;