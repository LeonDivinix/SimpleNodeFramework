/**
 * Created by leon on 15/11/21.
 * 获得数据库连接
 */
var dbConfig = require("../config/database"); // todo: 动态化
var special = require("./db/" + dbConfig.dbDialect);
var dbInfo = {
    dbConfig: dbConfig,
    getFields: special.getFields
    //
};
module.exports = dbInfo;