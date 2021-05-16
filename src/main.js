// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store/sotre';
import { axiosPost } from './utils/AxiosUtils';
import StringUtils from './utils/StringUtils';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs';
import axios from 'axios'
import { initMenu } from './utils/MenuUtils';

Vue.config.productionTip = false
Vue.prototype.$axiosPost = axiosPost
Vue.prototype.$StringUtils = StringUtils
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.use(ElementUI)

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 这里可以做权限判断，比如：token如果存在，再去初始化菜单
  if (window.sessionStorage.getItem('orkasgb_satoken')) {
    initMenu(router, store);
    if (!window.sessionStorage.getItem('userInfor')) {
        // return axiosPost('admin/infor').then(resp => {
        //   if (resp) {
        //     window.sessionStorage.setItem('userInfor', JSON.stringify(resp.data));
        //     next();
        //   }
        // });
    }
    next();
  } else if (to.path == '/') {
    next();
  } else {
    next('/?redirect' + to.path)
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

