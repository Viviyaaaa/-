import { SAVE_USER_INFO,DELETE_USER_INFO } from "../action_types";


export const saveUserInfoAction=(value)=>{

    localStorage.setItem('user',JSON.stringify(value))
    localStorage.setItem('isLogin',true)
   return  {type:SAVE_USER_INFO,data:value}

}

export const deleteUserInfoAction=()=>{

    localStorage.removeItem('user')
    localStorage.removeItem('isLogin',true)
   return  {type:DELETE_USER_INFO}

}
