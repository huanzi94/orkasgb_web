import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
import login from '@/components/login/Login' // 登录界面
import home from '@/components/commons/Home' // home页
import error from '@/components/commons/Error' // error页
import index from '@/components/commons/Index' // index页
import personalCenter from '@/components/userinfo/PersonalCenter' // PersonalCenter页


// 要告诉 vue 使用 Router
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'error',
      component: error
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/index',
          name: '首页',
          component: index
        },
        {
          path: '/personalCenter',
          name: '个人中心',
          component: personalCenter
        }
      ]
    }   
  ]
})

