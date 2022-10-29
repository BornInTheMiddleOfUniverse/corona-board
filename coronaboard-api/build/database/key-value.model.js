"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var KeyValue = function KeyValue(sequelize) {
  return sequelize.define('KeyValue', {
    id: {
      autoIncrement: true,
      type: _sequelize.DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    key: {
      type: _sequelize.DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: _sequelize.DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize: sequelize,
    tableName: 'KeyValue',
    timestamps: false,
    indexes: [{
      name: 'PRIMARY',
      unique: true,
      fields: [{
        name: 'id'
      }]
    }, {
      name: 'key',
      unique: true,
      fields: [{
        name: 'key'
      }]
    }]
  });
};

var _default = KeyValue;
exports["default"] = _default;