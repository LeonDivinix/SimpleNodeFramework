/**
 * Created by leon on 15/12/3.
 */
var special = {
    getFields: function (tableName) {
        return "select * from describe_table_info('" + tableName + "')";
    }
};

module.exports = special;