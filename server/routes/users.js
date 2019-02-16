var express = require('express');
var router = express.Router();

// 引入数据库的链接模块
const connection=require("./connect");


router.all('*', (req, res, next) => {
  // 先设置响应头
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  // 设置允许设置cookie
  res.setHeader('Access-Control-Allow-Credentials', true);
  // 给其他路由放行
  next();
})




// --------------------------
/**
 * 检测用户是否可以登录-用户名和密码是否存在  /checklogin   前端首页
 */
router.post('/checklogin', (req, res) => {
  // 接收用户名和密码
  let { username, password } = req.body;

  // 构造sql 查询用户名和密码是否存在（且的关系）
  const sqlStr = `select * from users where username='${username}' and password='${password}'`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data.length) {
        // 设置cookie 必须设置在res.send()之前  路由守卫与这里有关 
        res.cookie('userid', data[0].id);
        res.cookie('username', data[0].username);

        console.log(data);

        res.send({"rstCode":1, "msg":"欢迎您!"+data[0].username+" 登录成功!"})
      } else {
        res.send({"rstCode":0, "msg":"请检查用户名或密码!"})
      }
    }
  })
})
// -------------------------


// ---------------
/**
 * 检查用户登录状态-（是否已经登录过）---这里跟路由防卫有关哦-----
 */
router.get('/checkIsLogin', (req, res) => {
  // 获取浏览器的cookie
  let userid = req.cookies.userid;
  let username = req.cookies.username;
    
  // 如果都存在 证明用户登录过 
  if (userid && username) {
    // 存在 证明登录过
    res.send({"isLogin": true})
  } else {
    // 不存在 证明没有登录
    res.send({"isLogin": false})
  }
})
// --------------

router.get("/",(req,res)=>{
  res.end("这是后端的路由，这里是users");
})

 //接受添加账号请求的路由
router.post("/adduser",(req,res)=>{

// 接受前端传过来的参数
let {username,password,usergroup }=req.body;
console.log(username,password,usergroup);

// 把数据存入数据库
// 这是写的插入语句
const sqlStr=`insert into users(username,password,usergroup) values ('${username}','${password}','${usergroup}')`;

connection.query(sqlStr,(err,data)=>{
  if(err){
    throw err;
  }else{
    // console.log(data);
    if(data.affectedRows>0){
      res.send({"rstcode":1, "errMsg":"添加账号已经成功了"})  
    }else{
        res.send({"rstcode":0,"errMsg":"添加账号失败"})
    }
  }
})

  // res.setHeader("Access-Control-Allow-Origin","*");
  // // res.end("路由同了");  不能有两个send
})


//接受用户 账号列表的请求（所有的数据）
router.get("/userslist",(req,res)=>{
  // 设置相应的头
  // res.setHeader("Access-Control-Allow-Origin","*");
  // res.send("路由同了" );
  // 构造sql查询所有的用户账号数据
  const sqlStr='select*from users order by cdate desc';
  // 执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
      // 把查询到的所有用户账号数据  响应返回给前端
      res.send(data) 
    }
  })
})


// 接受单条删除的请求/deluser 就是点击删除旁边的那个按钮
router.get('/deluser',(req,res)=>{
    // 设置相应的头
    // res.setHeader("Access-Control-Allow-Origin","*");
    // 接受id
    let {id}=req.query;
    //  构造sql语句（单条删除操作)
    const sqlStr=`delete from users where id=${id}`;
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
  const sqlStr = `select * from users where id=${id}`;
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
 * 接收保存修改用户的请求  /saveedit  这一个版块就是当您修改好了之后   点击确定  将修改后的数据重新放回数据库里面
 */
router.post('/saveedit', (req, res) => {
  // 接收新的数据 和 一个原来的id
  let { username, password, usergroup, editId }  = req.body;

  // 构造sql语句（修改的sql）
  const sqlStr = `update users set username='${username}', password='${password}', usergroup='${usergroup}' where id=${editId}`;
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
  let sqlStr = `select * from users order by id desc`;
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
  const sqlStr = `delete from users where id in (${idArr})`;
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
 