import {message} from 'antd'
import axios from 'axios'
import NPropress from 'nprogress'
import qs from 'qs'
import store from '../redux/store'
import {deleteUserInfoAction} from '../redux/action_creators/saveUser_action'
import 'nprogress/nprogress.css'


const instance = axios.create({

    timeout: 4000,

  });

// 请求拦截器
instance.interceptors.request.use(function (config) {
    NPropress.start()
    const {method,data}=config
    if(method.toLowerCase==='post'){
      // 若传递过来的参数是对象
        if(data instanceof Object){
          qs.stringify(data)
    }
    }

   return config;
  }, function (error) {
    return Promise.reject(error);
  });


// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 请求若成功
    NPropress.done()
    return response.data;
  }, function (error) {
    
    NPropress.done()
    if(error.response.status===401){
      message.error('身份校验失败，请重新登录',1)
      // 分发一个删除用户信息的action
      store.dispatch(deleteUserInfoAction())
    }else{
      // 请求若失败,提示错误（这里可以处理所有请求的异常）
        message.error(error.message,1)
    }
  //  中断Promise链
    return new Promise(()=>{})
  });

export default instance