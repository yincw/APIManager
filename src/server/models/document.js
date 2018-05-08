var db = require('./db');
var Sequelize = require('sequelize');

var Document = db.define('Document', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100)
    },
    language_id: {// 外键 -> Language
      type: Sequelize.STRING(100)
    },
    group_id: {// 外键 -> DocumentGroup
      type: Sequelize.STRING(100)
    },
    language: {
      type: Sequelize.STRING(100)
    },
    version: {
      type: Sequelize.STRING(100)
    },
    icon: {
      type: Sequelize.STRING(100)
    },
    //用户自定义隐藏或者显示
    isShow: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    sort: {
      type: Sequelize.BIGINT(13),
      defaultValue: function() {
        return new Date().getTime();
      },
    }, //排序
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
  tableName: 'document'
});

module.exports = Document;