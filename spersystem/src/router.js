//// 引入vue--模块
import Vue from 'vue'

// 引入路由--模块
import Router from 'vue-router'

//   引入组件两种方式
// import Home from './views/Home.vue'

// 注册路由(使用路由)
Vue.use(Router);

// 导出路由实例对象
export default new Router({
  routes: [
    {
      path: '/login',   // 路径
      name: 'login',    // 名字
      //引入登录组件
      component: ()=>import('./views/Login/Login.vue')  //引入登录的组件
    //    访问这个页面是  http://127.0.0.1:8080/#/login
    },

    {
        path: '/',  // 路径
        component: () => import('./views/Index/Index.vue'),  // 引入后端首页组件
        children: [
            {
                path: '',
                component: () => import('./views/Home/Home.vue')
            },

            {
                path: '/accountadd',  //这是添加账号的路径
                name: 'accountadd',
                component: () => import('./views/AccountAdd/AccountAdd.vue')
            },
            {
                path: '/accountmanage',  //账号管理
                name: 'accountmanage',
                component: () => import('./views/AccountManage/AccountManage.vue')
            },

            
            {// 在这里写修改密码的路径
              path: '/passwordmodify',  //修改密码
              name: 'passwordmodify',   //名称
              component: () => import('./views/PasswordModify/PasswordModify.vue') //路径
            },

            {// 这里是个人中心的路由
              path: '/personal',  //访问的路径名
              name: 'personal',   //名称
              component: () => import('./views/Personal/Personal.vue') //路径
            },


            // 在这里写的是商品管理部分
            {
              path: '/goodsadd',  //
              name: 'goodsadd',   //
              component: () => import('./views/GoodsAdd/GoodsAdd.vue') //路径
            },

              // 商品列表的部分
              {
                path: '/goodsmanage',  //
                name: 'goodsmanage',   //
                component: () => import('./views/GoodsManage/GoodsManage.vue') //路径
              },

              // 表格导出
              {
                path: '/exporttable',  //
                name: 'exporttable',   //
                component: () => import('./views/ExportTable/ExportTable.vue') //路径
              }
           
        ]

      

    },




 
  ]
})
