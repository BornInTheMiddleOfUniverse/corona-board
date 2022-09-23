const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'KeyValue',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'KeyValue', // yet 'GlobalStat'
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          fields: [{ name: 'id' }],
        },
        { 
          name: 'key', //yet 'ccWithDate'
          unique: true,
          fields: [{ name: 'key' }], //fields: [{ name: 'cc'}, {name: 'date' }]
        },
      ],
    },
  );
};
