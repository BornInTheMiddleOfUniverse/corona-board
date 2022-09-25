const Sequelize = require("sequelize");
require('dotenv').config();

const config = {
  host: process.env.CORONABOARD_MYSQL_HOST,
  port: 3306,
  database: "coronaboard",
  user: "coronaboard_admin",
  password: process.env.CORONABOARD_MYSQL_PASSWORD,
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "mysql",
});
module.exports = {
  sequelize,
  GlobalStat: require("./global-stat.model")(sequelize),
  KeyValue: require("./key-value.model")(sequelize),
};
