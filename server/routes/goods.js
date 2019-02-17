var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '这是商品处理路由' });
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
 * 添加商品的请求 /addgoods
 */
router.post('/addgoods', (req, res) => {
 
  // 接收参数
  let { cateName, barCode, goodsName, salePrice, marketPrice, costPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc } = req.body;

  // 构造sql语句
  const sqlStr = 'insert into goods(cateName, barCode, goodsName, salePrice,marketPrice, costPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc) values(?,?,?,?,?,?,?,?,?,?,?,?)';
  // 接收到的数据参数
  const sqlParams = [cateName, barCode, goodsName, salePrice, marketPrice, costPrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc]

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

/**
 * 商品列表 /goodslist
 */
router.get('/goodslist', (req, res) => {

  // 构造sql 查询所有用户账号数据 
  /* 
    order by 字段 修饰符（asc desc） 按照这个字段排序 默认是升序 asc是升序 desc是降序
  */
  const sqlStr = 'select * from goods order by ctime desc' 
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err // 如果有错 抛出错误
    } else {
      // 否则 把查询到的所有用户账号数据 响应（返回）给前端
      res.send(data)
    }
  })
});

/**
 * 商品查询路由 /search
 */
router.get('/search', (req, res) => {
  // 接收查询关键字
  let { cateName, keyWord } = req.query;

  // 构造sql语句 按照条件查询 如果什么都不选 那么就是查询全部
  let sqlStr = `select * from goods where 1 = 1`;

  // 如果有分类名称 且 分类名称不等于全部 那么 拼接分类条件
  if (cateName !=='' && cateName !== '全部') {
    sqlStr += ` and cateName='${cateName}'`;
  }

  // 如果有分类名称 或 条形码 那么 拼接分类条
  if (keyWord !=='') {
    sqlStr += ` and (goodsName like "%${keyWord}%" or barCode like "%${keyWord}%")`
  }

  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.send(data);
    }
  })
})

/**
 * 商品分页： /goodslistbypage
 */
router.get('/goodslistbypage', (req, res) => {

  // 接收两个参数 （两个分页条件）currentPage(当前页码)  pageSize(每页多少条)
  let { currentPage, pageSize, cateName, keyWord } = req.query;

  /* 设置默然参数 */
  currentPage = currentPage ? currentPage : 1;
  pageSize = pageSize ? pageSize : 3;

  let sqlStr = 'select * from goods where 1 = 1';
  
  
  // 执行sql语句 查询所有数据 计算出数据总条数
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err // 如果有错 抛出错误
    } else {
      let total = data.length; // 数据总条数据

      // 如果有分类名称 且 分类名称不等于全部 那么 拼接分类条件
      if (cateName !=='' && cateName !== '全部') {
        sqlStr += ` and cateName='${cateName}'`;
      }

      // 如果有分类名称 或 条形码 那么 拼接分类条
      if (keyWord !=='') {
        sqlStr += ` and (goodsName like "%${keyWord}%" or barCode like "%${keyWord}%")`
      }

      // 执行sql语句
      connection.query(sqlStr, (err, data) => {
        if (err) {
          throw err;
        } else {
          // 重新计算数据总条数 安装查询的结果分页
          total = data.length;
        }
      })
      
      // 排序
      sqlStr += ` order by ctime desc`;

      // 计算分页条件
      let n = (currentPage - 1) * pageSize;
      // 构造分页查询的sql语句
      sqlStr += ` limit ${n}, ${pageSize}`;
      // 执行sql语句
      connection.query(sqlStr, (err, data) => {
        if (err) {
          throw err;
        } else {
          res.send({"total": total, "data":data});
        }
      })
    }
  })
});





module.exports = router;
