var Sequelize = require('sequelize');
var path = require('path');
var config = require('../config');
var electron = require('electron');

//可配置多个数据库
var db = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'sqlite',
  logging: process.env.NODE_ENV === 'development' ,
  pool: {
    max: 50,
    min: 0
  },
  storage:path.join(electron.app.getPath('userData'), 'database.sqlite')
});
module.exports = db;
