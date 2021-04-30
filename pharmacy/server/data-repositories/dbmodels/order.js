const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Order = sequelize.define('Order',
    {
        medicine_order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        patient_first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        patient_last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
    timestamps: false,
    tableName: 'medicine_order'
});

module.exports = Order;