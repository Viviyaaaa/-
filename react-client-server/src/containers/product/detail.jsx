import React, { Component } from 'react'
import { Button, Card,Icon,List} from 'antd'
import {createSaveProductAction} from '../../redux/action_creators/product_action'
import './detail.less'
import { connect } from 'react-redux'
import {reqCategoryList} from '../../api'
import { BASE_URL } from '../../config'

class Detail extends Component {
  state={
    categoryId:'',
    categoryName:'',
      name:'',
      desc:'',
      price:'',
      detail:'',
      imgs:[],
      isloading:true,

  }

  getCategoryList=async()=>{
    let res=await reqCategoryList()
    const {data,status,msg}=res
    if(status===0){
      let result=data.find((item)=>{
        return item._id===this.categoryId
      })
      this.setState({
          categoryName:result.name,
          isloading:false
      })
    }
  }

  componentDidMount(){

    const reduxProdList=this.props.productList
    const reduxCateList=this.props.categoryList
    const {id}=this.props.match.params
    if(reduxProdList.length){

      let result=reduxProdList.find((item)=>{
      return item._id===id
    
    })
   if(result){
     
    this.categoryId=result.pCategoryId

    this.setState({...result})

   }

  } 
 
   




    if(reduxCateList.length){
      
      let result=reduxCateList.find((item)=>{
      
      return item._id===this.categoryId

    })
   
// const {categoryId,name,desc,price,detail,imgs}=result
//     this.setState({
//          categoryId,
//          name,
//          desc,
//          price,
//          detail,
//          imgs
//     })
      this.setState({
        categoryName:result.name,
        isloading:false
      })
    }else{
      this.getCategoryList()
    }



  }
  render() {
    return (
        <Card title={
        <div className='left-top'>
            <Button type="link" size="small" onClick={()=>{this.props.history.goBack()}}>
                <Icon type="arrow-left" style={{fontSize:"20px"}} />
            </Button>

            <span>商品详情</span>
        </div>
        } >
        <List loading={this.state.isloading}>
        <List.Item>
        <span className='prod-name'>商品名称：</span>
        <span>{this.state.name}</span>
       </List.Item>
       <List.Item>
        <span className='prod-name'>商品描述：</span>
        <span>{this.state.desc}</span>
       </List.Item>
       <List.Item>
        <span className='prod-name'>商品价格：</span>
        <span>{this.state.price}</span>
       </List.Item>
       <List.Item>
        <span className='prod-name'>所属分类：</span>
        <span>{this.state.categoryName}</span>
       </List.Item>
       <List.Item>
        <span className='prod-name'>商品图片：</span>
        {
          this.state.imgs.map((item,index)=>{
            
            return <img src={`${BASE_URL}/upload/`+item} alt="商品图片" style={{width:'150px'}} key={index}/>
          })
        }

       </List.Item>
       <List.Item>
        <span className='prod-name'>商品详情：</span>
        <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
       </List.Item>
        </List>






      </Card>
    )
  }
}

export default connect(
    state=>({
      productList:state.productList,
      categoryList:state.categoryList

    }),
    {saveProduct:createSaveProductAction
    }
)( Detail)