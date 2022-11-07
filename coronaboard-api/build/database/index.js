"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = _interopRequireDefault(require("sequelize"));
require("dotenv/config");
var _globalStat = _interopRequireDefault(require("./global-stat.model"));
var _keyValue = _interopRequireDefault(require("./key-value.model"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var config = {
  host: process.env.CORONABOARD_MYSQL_HOST,
  port: 3306,
  database: "coronaboard",
  user: "coronaboard_admin",
  password: process.env.CORONABOARD_MYSQL_PASSWORD
};
var sequelize = new _sequelize["default"](config.database, config.user, config.password, {
  host: config.host,
  dialect: "mysql"
});
var db = {
  sequelize: sequelize,
  GlobalStat: (0, _globalStat["default"])(sequelize),
  KeyValue: (0, _keyValue["default"])(sequelize)
};
var _default = db;
exports["default"] = _default;