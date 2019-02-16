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
  
        // 如果没有登录
        if (!isLogin) {
          // 如果要进入的不是登录页面  那么就跳转到登录页面
          if (to.path !== '/login') {
            return next({"path": "/login"})
          } else {
            // 如果要去的本来就是登录页面 那么 直接放行
            next()
          }
        } else {
          // 已经登录 放行
          next()
        }
      })
  
    // 放行
    next();
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
