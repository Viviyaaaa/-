import {SAVE_TITLE,DELETE_TITLE} from '../action_types'

export const createSaveTitleAction=(value)=>{
   return {type:SAVE_TITLE,data:value}
}

export const deleteTitleAction=(value)=>{
   return {type:DELETE_TITLE,data:value}
}