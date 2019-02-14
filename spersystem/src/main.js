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
import 'element-ui/lib/theme-chalk/index.css'; // 样式文件

// 引入顶级组件 App.vue
import App from './App.vue'
// 引入路由文件
import router from './router'

// 
import axios from 'axios'

Vue.prototype.axios=axios;



// 引入公用样式
import '@/styles/common.less';

// 注册（使用）elementui
Vue.use(ElementUI);




//  阻止生产提示
Vue.config.productionTip = false;

// 创建vue实例对象 挂载dom 把路由 和 app顶级组件传入 渲染进入dom容器中
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
