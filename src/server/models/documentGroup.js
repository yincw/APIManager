var db = require('./db');
var Sequelize = require('sequelize');

var DocumentGroup = db.define('DocumentGroup', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    name: {type: Sequelize.STRING(100)},
    status: { type: Sequelize.INTEGER},
    sort: { type: Sequelize.INTEGER},
    is_show: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
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
  tableName: 'document_group'
});

module.exports = DocumentGroup;
