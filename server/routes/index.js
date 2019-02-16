var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 
// router.beforeEach((to, from, next) => {
// alert("路由由我防卫--我是全局路由")
// });


module.exports = router;
