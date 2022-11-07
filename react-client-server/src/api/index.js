import myAxios from './myAxios'
import jsonp from 'jsonp'
import {BASE_URL,WEATHER_KEY,CITY} from '../config'
import { message } from 'antd'

// 登录请求
export const reqLogin=(username,password)=>myAxios.post(`${BASE_URL}/login`,{username,password})

// 获取商品列表请求
export const reqCategoryList=()=>myAxios.get(`${BASE_URL}/manage/category/list`)

//新增商品分类 
export const reqAddCategoryList=({categoryName})=>myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})

//获取天气信息
export const reqWeather=()=>{
    return new Promise((resolve,reject)=>{
        jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?key=${WEATHER_KEY}&city=${CITY}&extensions=base&output=JSON`,(err,data)=>{
             if(err){
                message.error('请求天气接口失败，请联系管理员')
                return new Promise(()=>{})
             }else{
                let {weather,temperature}=data.lives[0]
           let weatherObj={weather,temperature}
            resolve(weatherObj)
             }

        })
    })

}

// 更新一个商品分类
export const reqUpdateCategory=(categoryId,categoryName)=>myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})


// 请求商品分页列表
export const reqProductList=(pageNum,pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})


// 请求更新商品状态
export const reqProdStatus=(productId,status)=>myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})


// 搜索商品
export const reqSearchProduct=(pageNum,pageSize,searchType,keyWord)=>myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyWord}})

// 请求删除图片（根据图片唯一名删除）
export const reqDeletePicture=(name)=>myAxios.post(`${BASE_URL}/manage/img/delete`,{name})

// 请求添加商品
export const reqAddProduct=(productObj)=>myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})

//请求更新商品
export const reqUpdateProduct=(productObj)=>myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})

// 请求所有角色列表
export const reqRoleList=()=>myAxios.get(`${BASE_URL}/manage/role/list`)

// 请求添加角色
export const reqAddRole=({roleName})=>myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})


// 请求给角色授权
export const reqUpdateRole=(roleObj)=>myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})


// 请求获取所有用户列表（同时携带着角色列表）
export const reqUserList=()=>myAxios.get(`${BASE_URL}/manage/user/list`)

// 请求添加用户
export const reqAddUser=(roleObj)=>myAxios.post(`${BASE_URL}/manage/user/add`,{...roleObj})

//删除用户
export const reqDeleteUser = (userId) => myAxios.post(`${BASE_URL}/manage/user/delete`, {userId})

// 更新用户
export const reqUpdateUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/update`, {...userObj})





