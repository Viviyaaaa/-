import {SAVE_TITLE,DELETE_TITLE} from '../action_types'



// 初始化title数据
let initState=''
export default function test(preState=initState,action){
      const {type,data}=action
      let newState
      switch (type) {
        case SAVE_TITLE:

            newState=data
            return newState

        case DELETE_TITLE:

            newState=''
            return newState

        default:
            return preState
      }
}