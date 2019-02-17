var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '这是分类处理' });
});



// 设置响应头 允许跨域
router.all('*', (req, res, next) => {
  // 先设置响应头
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  // 设置允许设置cookie
  res.setHeader('Access-Control-Allow-Credentials', true);
  // 给其他路由放行
  next();
})

/**
 * 引入数据库连接模块
 */
const connection = require('./connect');


/**
 * 接受会员添加的请求的请求 /memberadd
 * 
 * cateName varchar(50), 
   salePrice text,    
   discount varchar(20)  
 */
router.post('/sortadd', (req, res) => {
 
  // 接收参数
  let { cateName, salePrice,discount } = req.body;

  // 构造sql语句
  const sqlStr = 'insert into sortgoods(cateName, salePrice,discount ) values(?,?,?)';
   console.log(sqlStr);
  // 接收到的数据参数
  const sqlParams = [ cateName, salePrice,discount]

  // 执行sql语句
  connection.query(sqlStr, sqlParams, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果受影响的数据行数 > 0 就是成功
      if (data.affectedRows > 0) {
        // 返回成功的信息（数据对象）给前端
        res.send({"rstCode": 1, "msg":"添加商品成功"})

      } else {
        // 否则就是失败 返回失败的信息（数据对象）给前端
        res.send({"rstCode": 0, "msg":"添加商品失败"})
      }
    }
  })
})



// /**
//  * 商品列表 /memberlist
//  */
// router.get('/memberlist', (req, res) => {

//   // 构造sql 查询所有用户账号数据 
//   /* 
//     order by 字段 修饰符（asc desc） 按照这个字段排序 默认是升序 asc是升序 desc是降序
//   */
//   const sqlStr = 'select * from member order by ctime desc' 
//   // 执行sql语句
//   connection.query(sqlStr, (err, data) => {
//     if (err) {
//       throw err // 如果有错 抛出错误
//     } else {
//       // 否则 把查询到的所有用户账号数据 响应（返回）给前端
//       res.send(data)
//     }
//   })
// });




module.exports = router;
