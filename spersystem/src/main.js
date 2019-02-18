// import Vue from 'vue'
//
// // 引入elementui的组件 和 样式
// import ElementUI from 'element-ui' // 组件文件（js）
// import 'element-ui/lib/theme-chalk/index.css'; // 样式文件
//
// import App from './App.vue'
// import router from './router'
//
//
// //引入axios文件,它是在nodule，它时候一个模块
// // import axios from 'axios'
//
// //把axios挂载到每个vue的实例对象、
// // Vue.prototype.axios=axios;
//
// // 引入公用样式
// import '@/styles/common.less';
//
//
//
// //注册element 使用
// Vue.use(ElementUI);
//
// Vue.config.productionTip = false;
//
// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')


// 引入vue
import Vue from 'vue'

// 引入elementui的组件 和 样式
import ElementUI from 'element-ui'; // 组件文件（js）

// 在这里Vue在前  ElementUI在后
import 'element-ui/lib/theme-chalk/index.css'; // 样式文件


// 引入顶级组件 App.vue
import App from './App.vue'
// 引入路由文件
import router from './router'

// // 引入axios
import axios from 'axios'

//直接把 axios 挂载在Vue的原型上
Vue.prototype.axios=axios;

// ------------------------------

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 定义一个登录状态
  let isLogin;

  // 允许携带cookie
  axios.defaults.withCredentials=true;
  // 发送请求 去检查用户是否登录（是否有cookie）
  axios.get('http://127.0.0.1:3000/users/checkIsLogin')
    .then(response => {
      isLogin = response.data.isLogin;

      // 如果已经登录 true 直接放行
      if (isLogin) {
        next()
      } else {
        // 否则是 false
        // 如果去的是登录页
        if (to.path === '/login') {
          next()
        } else {
          // 如果去的是其他页码 跳转到登录页面
          return next({'path': '/login'})
        }
      }
    })
}) 
 

//   ---------------------
// 引入公用样式
import '@/styles/common.less';

// 注册（使用）elementui  下面的这个Vue是34行引入进来的
Vue.use(ElementUI);




//  阻止生产提示
Vue.config.productionTip = false;

// 创建vue实例对象 挂载dom 把路由 和 app顶级组件传入 渲染进入dom容器中
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
