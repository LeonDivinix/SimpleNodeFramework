/**
 * Created by leon on 15/11/15.
 */
var config = {
    dbDialect: "postgres", // 数据库存
    dbHost: "localhost", // 服务器
    dbName: "rbac", // 数据库名称
    dbPort: "5432", // 数据库端口
    dbUser: "leon", // 用户名
    dbPwd: "112233", // 密码
    dbMax: 5, // db线程池数量
    dbIdle: 100000 // 超时时间

};

module.exports = config;