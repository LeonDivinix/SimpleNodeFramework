/**
 * Created by leon on 15/11/12.
 */
var express = require('express');
var router = express.Router();
var db = require(".././db");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index');
});

//
router.get('/getMenus', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * from s_t_menu', function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            if(err) {
                return console.error('error running query', err);
            }
            //console.log(result.rows);
            res.send({flag: 0, result: result.rows});
        });
    });
});

router.get('/test', function(req, res, next) {
    //db.querySql("select * from s_t_menu");
    db.querySql("select * from s_t_menu");

    res.send("11111");
});

module.exports = router;