import { SAVE_PRODUCT } from "../action_types"

export const createSaveProductAction=(value)=>{
      return {type:SAVE_PRODUCT,data:value}
}