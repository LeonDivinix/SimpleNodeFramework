/**
 * Created by leon on 2015/11/23.
 */
var db = require("./db");
var model = function model(prefix, tableName, fields, options) {
    // 创建Model
    var that = db.define(tableName, fields, options);

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