var db = require('./db');
var Sequelize = require('sequelize');

var TagUnionApi = db.define('TagUnionApi', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    tag_id: {type: Sequelize.UUID},
    api_id: {type: Sequelize.UUID},
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
  tableName: 'tag_union_api'
});

module.exports = TagUnionApi;