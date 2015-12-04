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

var Model = function (prefix, tableName, map, attributes, options) {
    console.info(__filename);
    var that = this;
    that.prefix = prefix;
    that.tableName = tableName;
    that.fullTableName = that.prefix + that.tableName;
    if (undefined !== map) {
        that.map = map;
    }
    if (undefined !== attributes) {
        that.attributes = attributes;
    }
    if (undefined !== options) {
        that.options = options;
    }
    else {
        that.options = {timestamps: false};
    }
    that.options.tableName = that.fullTableName;
    //that.fields = {id: {type: Sequelize.INTEGER, primaryKey: true}, table_name:{type: Sequelize.STRING}};
    dbInfo.getFields(sequelize, that.fullTableName, that.map, function(results) {
        that.fields = results;
        console.info(1);
        console.info(that.fields);
        console.info(2);
    });
};

Model.prototype.prefix = "";
Model.prototype.tableName = "";
Model.prototype.fullTableName = "";
Model.prototype.map = {};
Model.prototype.attributes = {};
Model.prototype.options = {timestamps: false};
Model.prototype.fields = {};
Model.prototype.querySql = function(sql, options) {
    return sequelize.query(sql, undefined === options ? { type: db.QueryTypes.SELECT } : options);
};
Model.prototype.executeSql = sequelize.query;

Model.prototype.modelInstance = function() {
    console.info(this.fields);
    console.info(this.fullTableName);
    return sequelize.define(this.fullTableName, this.fields, this.options);
};


// 创建Model
//var fullTableName = prefix + tableName;
//map = {ffff: "KEYkey"};
//dbInfo.getFields(orm, fullTableName, map, function(results, model) {
//    orm.define(fullTableName, results, {tableName: fullTableName, timestamps: false});
//});
//
//if (undefined != attributes) {
//    //todo: 补属性
//}
//if (undefined != options) {
//    //todo: 补属性
//}


//var that = orm.define(fullTableName, dbInfo.getFields(orm, fullTableName), {tableName: fullTableName, timestamps: false});
//console.info(dbInfo.getFields(orm, fullTableName));
//console.info(1111);
//
//that.querySql = function(sql, fn) {
//    orm.query(sql, { type: db.QueryTypes.SELECT }).then(function (results) {
//        // fn(results);
//        console.info(results);
//        return results;
//    })
//};
//that.executeSql = function(sql, fn) {
//    orm.query(sql).spread(function (results, metadata) {
//        // fn(results);
//        console.info(results);
//        console.info(metadata);
//    });
//};
//return that;

module.exports = Model;