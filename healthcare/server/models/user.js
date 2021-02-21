const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'user'
});

// Promise
//     .all([
//         User.sync({ force: true }),
//     ]).then(_ => {
//         bcrypt.hash("password", saltRounds, function (err, hash) {
//             const user = User.create({
//                 username: 'admin',
//                 password: hash,
//                 first_name: "first",
//                 last_name: "last",
//                 user_status: 1,
//                 user_type: 1,
//             });
//         })
//     });


module.exports = User;
