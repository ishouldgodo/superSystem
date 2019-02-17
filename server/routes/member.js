var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: '这是会员管理的模块' });
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
 */
router.post('/memberadd', (req, res) => {
 
  // 接收参数
  let { cateName, barCode, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit,discount } = req.body;

  // 构造sql语句
  const sqlStr = 'insert into member(cateName, barCode, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit,discount ) values(?,?,?,?,?,?,?,?,?)';
   console.log(sqlStr);
  // 接收到的数据参数
  const sqlParams = [ cateName, barCode, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit,discount]

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
 * 商品列表 /memberlist
 */
router.get('/memberlist', (req, res) => {

  // 构造sql 查询所有用户账号数据 
  /* 
    order by 字段 修饰符（asc desc） 按照这个字段排序 默认是升序 asc是升序 desc是降序
  */
  const sqlStr = 'select * from member order by ctime desc' 
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



// 接受单条删除的请求/deluser 就是点击删除旁边的那个按钮
router.get('/deluser',(req,res)=>{
  // 设置相应的头
  // res.setHeader("Access-Control-Allow-Origin","*");
  // 接受id
  let {id}=req.query;
  //  构造sql语句（单条删除操作)
  const sqlStr=`delete from member where id=${id}`;
  // 构造sql根据收到的id删除这一条数据
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
       if(data.affectedRows>0){
        //  返回删除成功的信息给前端
        res.send({"rstCode":1,"msg":"删除成功"})
       }else{
        res.send({"rstCode":0,"msg":"删除失败"})  //msg注意要和前端的相互对应哦！
       }
    }
  })
})


/**
 * 接收修改 用户请求 - 数据回显 /edituser  
 * --这一个板块是数据回填   就是可以将原本的数据回填到文本框里面 -
 */
router.get('/edituser', (req, res) => {
  // 接收需要修改的数据的id
  let { id } = req.query;

  // 构造sql语句
  const sqlStr = `select * from member where id=${id}`;
  // 执行sql语句  marketPrice
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.send(data);
      console.log(data);
    }
  })
})



/**
 * 接收保存修改用户的请求  /saveedit  这一个版块就是当您修改好了之后   点击确定  将修改后的数据重新放回数据库里面 marketPrice:
 */
router.post('/saveedit', (req, res) => {
  // 接收新的数据 和 一个原来的id
  let { username, password, usergroup, editId }  = req.body;  //username
   
  // 构造sql语句（修改的sql）//username
  const sqlStr = `update member set marketPrice='${username}',goodsNum='${password}', discount='${usergroup}' where id=${editId}`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果受影响行数 大于0 就是修改成功 返回给前端修改成功的信息
      if (data.affectedRows > 0) {
        res.send({"rstCode":1, "msg":"修改成功!"})
      } else {
        // 否则就是修改失败 返回给前端修改失败的信息
        res.send({"rstCode":0, "msg":"修改失败!"})
      }
    }
  })
})



/* 
  按分页显示账号列表的路由 /accountlistbypage
*/
router.get('/accountlistbypage', (req, res) => {
  // 接收前端参数
  let {pageSize, currentPage} = req.query;
  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1

  // 构造sql语句 （查询所有数据 按照时间排序）   注意表，名称是否正确
  let sqlStr = `select * from member order by id desc`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 计算数据总条数
    let total = data.length;

    // 分页条件 (跳过多少条)
    let n = (currentPage - 1) * pageSize;
    // 拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;

    // 执行sql语句 （查询对应页码的数据）
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      // 把数据返回给前端 两个数据 数据总条数 total 和 对应页码的数据 data
      res.send({
        total,
        data
      })
    })
  })
})



/**
 * 后端接受数据  批量删除请求路由 /batchdel---- 这个板块是    批量删除数据
 */
router.post('/batchdel', (req, res) => {
  // 接收前端传过来的需要批量删除的id数组
  let { idArr } = req.body;
  // 把字符串类型数据转为数组
  idArr = JSON.parse(idArr);
  // 构造sql语句 执行批量删除
  const sqlStr = `delete from member where id in (${idArr})`;
  // 执行sql语句 
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      // 如果受影响行数 大于 0 就是删除成功 返回删除成功的信息给前端
      if (data.affectedRows > 0) {
        res.send({"rstCode":1, "msg":"批量删除成功"})
      } else {
        // 否则就是失败 返回失败的信息给前端
        res.send({"rstCode":0, "msg":"批量删除失败"})
      }
    }
  })
})


module.exports = router;
