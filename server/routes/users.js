var express = require('express');
var router = express.Router();

// 引入数据库的链接模块
const connection=require("./connect");


// 设置多个响应头--写在所有的路由之前  拦截所有的请求
router.all("*",(req,res,next)=>{
  // 设置相应的头
  res.setHeader("Access-Control-Allow-Origin","*");
  // 给其他的路由放行
  next();
})



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


// 接受单条删除的请求/deluser
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




module.exports = router;
 