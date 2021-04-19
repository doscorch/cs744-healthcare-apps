const schema = "peach_insurance"
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

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
  };

module.exports = sequelize;
