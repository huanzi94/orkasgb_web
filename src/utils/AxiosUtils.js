import axios from 'axios'
import { Message } from 'element-ui'
import * as httpCode from '../constant/HttpCodeConstant'
import router from "../router/router";
import store from '../store/sotre';

// 处理响应拦截器
axios.interceptors.response.use(success => {
  // 如果是调用后台接口成功
  if (success.status && success.status == httpCode.HTTP_CODE_200) {
    // 如果是后台逻辑错误
    if (success.data.code === httpCode.HTTP_CODE_5OO || success.data.code === httpCode.HTTP_CODE_400 || success.data.code === httpCode.HTTP_CODE_403) {
      Message.error(success.data.message);
      return;
    }
    if (success.data.message && success.data.code !== httpCode.HTTP_CODE_200) {
      Message.error(success.data.message);
    }
    return success;
  }
}, error => {
  if (error.code === httpCode.HTTP_CODE_5O4 || error.code === httpCode.HTTP_CODE_404) {
    Message.error("Server error");
  } else if (error.code === httpCode.HTTP_CODE_403) {
    Message.error("Insufficient permissions, please contact the administrator");
  } else if (error.code === httpCode.HTTP_CODE_401) {
    Message.error("Please log in before operation");
    window.localStorage.removeItem('token');
    router.replace("/");
  } else {
    if (error.message) {
      Message.error(error.message)
    } else {
      Message.error("unknown error");
    }
  }
  return;
}
);

// 请求拦截器
axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers['orkasgb_satoken'] = store.state.token;
  }
  config.headers['Content-Type'] = 'application/json; charset=UTF-8';
  return config;
});


let basePath = "http://127.0.0.1:8081";
// 分装post请求
export const axiosPost = (url, params, contentType) => {
  return axios({
    method: 'post',
    data: params,
    url: `${basePath}${url}`,
    headers: {
      'Content-Type': contentType
    },
    responseType: 'json'
  })
}
