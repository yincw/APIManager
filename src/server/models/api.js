var db = require('./db');
var Sequelize = require('sequelize');

var Api = db.define('Api', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false
    },
    name: {type: Sequelize.STRING(100)},
    class_name: {type: Sequelize.STRING(100)},//静态类型名称
    type: {type: Sequelize.ENUM('api', 'group')}, // 类型 group或者api
    group_type:{type: Sequelize.ENUM('class', 'collection')}, //分组类型 只有当type==group时候有用
    object_type: {type: Sequelize.INTEGER},
    parent_id: { type: Sequelize.INTEGER, required: true, },
    remark:{type: Sequelize.TEXT}, //备注
    sort: {
      type: Sequelize.BIGINT(13),
      defaultValue: function() {
        return new Date().getTime();
      },
    }, //排序
    description: {type: Sequelize.STRING(100)}, // 功能描述
    code: { type: Sequelize.TEXT }, //示例代码
    mode: { type: Sequelize.INTEGER }, //api模式 0:API模式 1：文档模式
    status: { type: Sequelize.INTEGER }, //api状态 new current
    release_status: { type: Sequelize.STRING(100) },//发布状态
    version_status: { type: Sequelize.INTEGER }, //文档成熟度 工作草案 候选推荐 推荐
    document_version: { type: Sequelize.STRING(100)}, //发布时所属文档的版本
    refer_to: {type:Sequelize.TEXT}, //参考文献
    compatibility: {type:Sequelize.TEXT}, //浏览器兼容状态
    document_id: { type: Sequelize.STRING(100) },
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
  tableName: 'api'
});

module.exports = Api;
