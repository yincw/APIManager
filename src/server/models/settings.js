var db = require('./db');
var Sequelize = require('sequelize');

var Settings = db.define('settings', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    sort_enable: {type: Sequelize.INTEGER},
    status: { type: Sequelize.INTEGER},
    created_at: {
      type: Sequelize.BIGINT(13),
      defaultValue: function() {
        return new Date().getTime();
      },
    },
    updated_at: {
      type: Sequelize.BIGINT(13),
      defaultValue: function() {
        return new Date().getTime()
      },
    }
},{
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  tableName: 'settings'
});

module.exports = Settings;