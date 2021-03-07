const schema = "peach_pharmacy"
const user = "root";
const password = "3peachDatabase!";
const host = "localhost";
const port = 3306;
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(schema, user, password, {
    dialect: 'mysql',
    host: host,
    port: port,
})
sequelize.authenticate();

module.exports = sequelize;
