/**
 * Created by leon on 15/12/3.
 */
var Sequelize = require("sequelize");
var special = {
    getFields: function (orm, tableName, map, fn) {
        var sql = "select * from describe_table_info('" + tableName + "')";
        orm.query(sql, { type: orm.QueryTypes.SELECT }).then(function (results) {
            var len = results.length;
            var i = 0;
            var subCount;
            var tmp;
            var fields = {};
            while (i < len) {
                //todo: numeric类型，精度处理
                // php -r "echo (1048580 >> 16) & 0xffff;" 16
                // php -r "echo (1048580) & 0xffff;" 4
                // type处理

                // 类型处理，字符类型额外做长度处理
                if ("STRING" === results[i].type || "CHAR" === results[i].type ) {
                    results[i].type = Sequelize[results[i].type](results[i].fieldLength);
                }
                else {
                    results[i].type = Sequelize[results[i].type];
                }
                delete results[i].fieldLength;

                // 默认值处理
                if ('' !== results[i].defaultValue) {
                    //todo? 自增长处理
                    if (0 === results[i].defaultValue.indexOf("nextval(")) {
                        results[i].autoIncrement = true;
                        delete results[i].defaultValue;
                    }
                    else if ('uuid_generate_v1()' === results[i].defaultValue) {
                        results[i].defaultValue = Sequelize.UUIDV1;
                    }
                    else if ('uuid_generate_v4()' === results[i].defaultValue) {
                        results[i].defaultValue = Sequelize.UUIDV4;
                    }
                    else if ('now()' === results[i].defaultValue) {
                        results[i].defaultValue = Sequelize.NOW;
                    }
                    else {
                        results[i].autoIncrement = false;
                        subCount = results[i].defaultValue.indexOf(":");
                        tmp = results[i].defaultValue.substr(0, subCount);
                        if ("''" === tmp) {
                            results[i].defaultValue = "";
                        }
                        else {
                            results[i].defaultValue = results[i].defaultValue.substr(0, subCount);
                        }
                    }
                }
                else if (results[i].allowNull) {
                    results[i].defaultValue = null;
                }
                if (undefined != map && undefined != map[results[i].field]) {
                    fields[map[results[i].field]] = results[i];
                }
                else {
                    fields[results[i].field] = results[i];
                }
                ++i;
            }
            if (undefined != fn) {
                fn(fields);
            }
            //console.info(fields);
        });
    }
};

module.exports = special;