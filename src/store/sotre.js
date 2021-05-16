import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        routes: [],
        token: ''
    },

    // 同步执行。
    mutations: {
        initRouters(state, data) {
            state.routes = data;
        },
        setToken(state, token) {
            state.token = token
            sessionStorage.token = token
        },
        delToken(state) {
            state.token = ''
            sessionStorage.removeItem('token')
        }
    },

    // 异步执行
    actions: {}

})