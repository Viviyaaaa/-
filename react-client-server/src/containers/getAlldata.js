//封装前端自循环调用接口拿到分页接口的全部数据
import { PAGE_SIZE } from '../config';
export async function callMethodLimitPage (fn, pageIndex, arr) {
    let res
  res=await fn(pageIndex,PAGE_SIZE)
  const {status,data}=res
  if(status==0){
    const dataClone = data.list|| [];
 
  if (arr.length+ PAGE_SIZE < data.total) {
    return callMethodLimitPage(fn,pageIndex + 1, [...arr, ...dataClone])
  }
  
  return new Promise((resolve) => {
    resolve({
      data: [...arr, ...dataClone].length ? [...arr, ...dataClone] : null,
      errorCode: 0,
      errorDesc: 'success',
      totalCount: [...arr, ...dataClone].length,
    })
  })
}

 
}
  