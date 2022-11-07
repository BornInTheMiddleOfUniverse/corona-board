"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var GlobalStat = function GlobalStat(sequelize) {
  return sequelize.define("GlobalStat", {
    id: {
      autoIncrement: true,
      type: _sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    cc: {
      type: _sequelize.DataTypes.CHAR(2),
      allowNull: false
    },
    date: {
      type: _sequelize.DataTypes.DATEONLY,
      allowNull: false
    },
    confirmed: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    death: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    released: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    tested: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    testing: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    negative: {
      type: _sequelize.DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize: sequelize,
    tableName: "GlobalStat",
    timestamps: false,
    indexes: [{
      name: "PRIMARY",
      unique: true,
      fields: [{
        name: "id"
      }]
    }, {
      name: "ccWithDate",
      unique: true,
      fields: [{
        name: "cc"
      }, {
        name: "date"
      }]
    }]
  });
};
var _default = GlobalStat;
exports["default"] = _default;