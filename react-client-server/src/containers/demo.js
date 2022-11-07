

// 获取图表需要的数据
export const countdata=(list1,list2)=>{
//list1是所有商品数据，list2是商品分类
var countlist=[];
var list3=[]



//获取商品分类名称，并放进新数组list3中
list2.map((item)=>{
   list3.push(item.name)
     
   })


   //获取所有商品数据的分类名称，并放进新数组countlist中
for (let i = 0; i < list1.length; i++) {
    let pre = list1[i];
    for (let j = 0; j <list2.length; j++) {
        let old = list2[j];
        if (pre.pCategoryId===old._id) {
            countlist.push(old.name);
           
        }
    }
}


// 获取各个分类名称及对应的数量，放进对象obj中
var obj={};
for(let i=0;i<countlist.length;i++){
    
    var item=countlist[i]
    obj[item]=obj[item]+1||1

}


//将对象转为对象数组
let list4=[];
for(let k in obj){
  list4.push({value:obj[k],name:k})
}

// 对象数组根据商品分类名称数组重新排序
list4.sort((a,b)=>{
    return list3.indexOf(a.name)-list3.indexOf(b.name)
})



//将排序之后的对象数组中的数量抽离出来，放进新数组list中
let list=new Array(list3.length).fill(0)

 for(let i=0;i<list3.length;i++){
    for(let j=0;j<list4.length;j++){
     let item=list4[j]
  if(item['name']==list3[i]){
    list[i]=item['value']
  }

}


}



return  [list3,list,list4]
}



