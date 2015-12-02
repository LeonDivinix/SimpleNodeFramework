/**
 * Created by leon on 15/11/21.
 * 单数据库应用
 * 连接池
 */
var conf = require("../config");
var Sequelize = require('sequelize');

var db = new Sequelize(conf.dbName, conf.dbUser, conf.dbPwd, {
    host: conf.dbHost,
    dialect: conf.dbDialect,
    port: conf.dbPort,
    pool: {
        maxConnections: conf.dbMax,
        minConnections: 0,
        maxIdleTime: conf.dbIdle
    }
});

db.querySql = function(sql, fn) {
    db.query(sql, { type: db.QueryTypes.SELECT }).then(function (results) {
        // fn(results);
        console.info(results);
    })
};

db.executeSql = function(sql, fn) {
    db.query(sql).spread(function (results, metadata) {
        // fn(results);
        console.info(results);
        console.info(metadata);
    });
};
module.exports = db;
//exports.querySql = querySql;
//exports.executeSql = executeSql;

/*
var querySqlOthter = function(sql, fn) {
    sequelize.query(sql).spread(function (results, metadata) {
        // fn(results);
        console.info(results);
        console.info(metadata);

         { command: 'SELECT',
         rowCount: 5,
         oid: NaN,
         rows: [],
         fields:
         [ { name: 'id',
         tableID: 16901,
         columnID: 1,
         dataTypeID: 2950,
         dataTypeSize: 16,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'pid',
         tableID: 16901,
         columnID: 2,
         dataTypeID: 2950,
         dataTypeSize: 16,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'level',
         tableID: 16901,
         columnID: 3,
         dataTypeID: 21,
         dataTypeSize: 2,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'title',
         tableID: 16901,
         columnID: 4,
         dataTypeID: 1043,
         dataTypeSize: -1,
         dataTypeModifier: 54,
         format: 'text' },
         { name: 'url',
         tableID: 16901,
         columnID: 5,
         dataTypeID: 1043,
         dataTypeSize: -1,
         dataTypeModifier: 259,
         format: 'text' },
         { name: 'pic',
         tableID: 16901,
         columnID: 6,
         dataTypeID: 1043,
         dataTypeSize: -1,
         dataTypeModifier: 259,
         format: 'text' },
         { name: 'remark',
         tableID: 16901,
         columnID: 7,
         dataTypeID: 1043,
         dataTypeSize: -1,
         dataTypeModifier: 104,
         format: 'text' },
         { name: 'sort',
         tableID: 16901,
         columnID: 8,
         dataTypeID: 23,
         dataTypeSize: 4,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'status',
         tableID: 16901,
         columnID: 9,
         dataTypeID: 21,
         dataTypeSize: 2,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'create_time',
         tableID: 16901,
         columnID: 10,
         dataTypeID: 1114,
         dataTypeSize: 8,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'create_by',
         tableID: 16901,
         columnID: 11,
         dataTypeID: 1042,
         dataTypeSize: -1,
         dataTypeModifier: 40,
         format: 'text' },
         { name: 'update_time',
         tableID: 16901,
         columnID: 12,
         dataTypeID: 1114,
         dataTypeSize: 8,
         dataTypeModifier: -1,
         format: 'text' },
         { name: 'update_by',
         tableID: 16901,
         columnID: 13,
         dataTypeID: 1042,
         dataTypeSize: -1,
         dataTypeModifier: 40,
         format: 'text' } ],
         _parsers:
         [ [Function: noParse],
         [Function: noParse],
         [Function],
         [Function: noParse],
         [Function: noParse],
         [Function: noParse],
         [Function: noParse],
         [Function],
         [Function],
         [Function: parseDate],
         [Function: noParse],
         [Function: parseDate],
         [Function: noParse] ],
         RowCtor: [Function],
         rowAsArray: false,
         _getTypeParser: [Function: bound ] }

    });
};
 */

//var dao = function(){};
//
//// 查询
//Dao.prototype.query = function(sql, fn) {
//    pg.connect(connectInfo, function(err, client, done) {
//        if(err) {
//            return console.error('error fetching client from pool', err);
//        }
//        client.query(sql, function(err, result) {
//            //call `done()` to release the client back to the pool
//            done();
//            if(err) {
//                return console.error('error running query', err);
//            }
//            //console.log(result);
//            fn(error, result.rows);
//        });
//    });
//};
//exports.query = function() {
//    return {
//        query: query = function(sql, fn) {
//            pg.connect(connectInfo, function(err, client, done) {
//                if(err) {
//                    return console.error('error fetching client from pool', err);
//                }
//                client.query(sql, function(err, result) {
//                    //call `done()` to release the client back to the pool
//                    done();
//                    if(err) {
//                        return console.error('error running query', err);
//                    }
//                    console.log(result);
//                    fn(error, result.rows);
//                });
//            });
//        }
//    };
//};