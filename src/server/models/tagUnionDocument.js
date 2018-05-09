var db = require('./db');
var Sequelize = require('sequelize');

var TagUnionDocument = db.define('TagUnionDocument', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    tag_id: {type: Sequelize.UUID},
    document_id: {type: Sequelize.UUID},
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
  tableName: 'tag_union_document'
});

module.exports = TagUnionDocument;