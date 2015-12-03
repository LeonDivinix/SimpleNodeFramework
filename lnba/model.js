/**
 * Created by leon on 2015/11/23.
 */
var dbInfo = require("./dbInfo");
var Sequelize = require('sequelize');

var sequelize = new Sequelize(dbInfo.dbConfig.dbName, dbInfo.dbConfig.dbUser, dbInfo.dbConfig.dbPwd, {
    host: dbInfo.dbConfig.dbHost,
    dialect: dbInfo.dbConfig.dbDialect,
    port: dbInfo.dbConfig.dbPort,
    pool: {
        maxConnections: dbInfo.dbConfig.dbMax,
        minConnections: 0,
        maxIdleTime: dbInfo.dbConfig.dbIdle
    }
});

var model = function db(prefix, tableName, attributes, options) {
    if (undefined != attributes) {
        //todo: 补属性
    }
    if (undefined != options) {
        //todo: 补属性
    }

    // 创建Model
    var fullTableName = prefix + tableName;
    var that = db.define(fullTableName, dbInfo.getFields(fullTableName), {tableName: fullTableName, timestamps: false});

    that.querySql = db.querySql(sql, fn);
    that.executeSql = db.executeSql(sql, fn);

    //that.add = function() {
    //    menu.sync({force: true}).then(function () {
    //        // Table created
    //        return menu.create({
    //            firstName: 'John',
    //            lastName: 'Hancock'
    //        });
    //    });
    //};

    var list = function() {
        that.findAndCountAll().then(function (result) {
            console.dir(result.rows[0].dataValues);
        });
    };

    return that;
};


module.exports = model;