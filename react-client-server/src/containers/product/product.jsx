import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Card, Select,Icon,Button,Input,Table, message} from 'antd';
import { reqProductList,reqProdStatus,reqSearchProduct } from '../../api';
import { PAGE_SIZE } from '../../config';
import {createSaveProductAction} from '../../redux/action_creators/product_action'
const { Option } = Select;
class Product extends Component {
  state={
    productList:[],  //商品列表数据（分页）
    total:'',  //一共有几页
    current:1,  //当前在哪一页
    keyWord:'',//搜索关键词
    searchType:'productName',//搜索名称
    
  }

  componentDidMount(){
    this.getProductList()
  }


  getProductList=async(num=1)=>{
    let res
    if(this.isSearch){
      res=await reqSearchProduct(num,PAGE_SIZE,this.state.searchType,this.state.keyWord)
    }

      else {res=await reqProductList(num,PAGE_SIZE)}
         
      const {status,data}=res
      if(status===0){
        this.setState({
          productList:data.list,
          total:data.total,
          current:data.pageNum
        })
        // 把获取的商品列表存入redux中
        this.props.saveProduct(data.list)

        
       
      }else{
        message.error('获取商品列表失败')
      }
  }
  getProdStatus=async({_id,status})=>{
    let productList=[...this.state.productList]
   
      if(status===1)  status=2
      else status=1
       let res=await reqProdStatus(_id,status)
       if(res.status===0){
          message.success('商品更新成功')

         productList=productList.map((item)=>{
          
              if(item._id===_id){
                item.status=status
              }
                return item

         })
         this.setState({
          productList
         })
       }else{
         message.error('商品更新失败')
       }
    }
search=async()=>{
   this.isSearch=true
   this.getProductList()

}

  render() {
    const dataSource = this.state.productList

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render:(price)=>{
            return '￥'+price
        }
      },

      {
        align:'center',
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        render:(item)=>{
           return (
           <div>
            <Button
            type={item.status===1?"danger":"primary"}
            onClick={()=>{this.getProdStatus(item)}}
            >
              {item.status===1?'下架':'上架'}</Button><br/>
            <span>{item.status===1?'在售':'已停售'}</span>
            </div>
           )
        }
      },
      {
        align:'center',
        title: '操作',

        key: 'opera',
        render:(item)=>{
          return (
            <div>
            <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
            <Button type="link"  onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
          </div>
          )


        }
      },
    ];
    return (

       <Card
      title={
        <div>
          <Select defaultValue="productName" style={{ width: 120 }} onChange={(value)=>((this.setState({searchType:value})))}>
      <Option value="productName">按名称搜索</Option>
      <Option value="productDesc">按描述搜索</Option>
         </Select>
       <Input placeholder='关键字' style={{width:'20%',margin:'0px 10px'}} allowClear onChange={(e)=>((this.setState({keyWord:e.target.value})))}/>
         <Button type="primary" onClick={this.search}>搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><Icon type="plus"/>添加商品</Button>}
      >
      <Table dataSource={dataSource} columns={columns} bordered rowKey='_id' pagination={{current:this.state.current,total:this.state.total,pageSize:PAGE_SIZE,onChange:this.getProductList}} />;
    </Card>



    )
  }
}


export default connect(
  state=>({productList:state.productList}),
  {
    saveProduct:createSaveProductAction,
  }
)(Product)
