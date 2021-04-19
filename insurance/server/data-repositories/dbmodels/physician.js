const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const Physcian = sequelize.define('Physcian', {
    physician_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    license: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'physicians'
});

module.exports = Physcian;