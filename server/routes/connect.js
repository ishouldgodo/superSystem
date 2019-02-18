const mysql=require("mysql");

const connection=mysql.createConnection({
    host:"localhost",  //默认链接的是本地
    user:"root",       //用户名
    password:"123456789",  //密码
    database:"smsm"  //链接的是哪个数据库
})

connection.connect(()=>{
    console.log("数据库链接成功");
})




// 因为别人要用connection ,所以我要将它暴露出去哦
module.exports=connection;