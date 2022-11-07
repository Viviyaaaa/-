import React, { Component } from 'react'
import {connect} from 'react-redux'
import {callMethodLimitPage} from '../getAlldata'
import {reqProductList} from '../../api';
import {countdata} from '../demo'
import ReactECharts from 'echarts-for-react';
import '../../../src/components/css/index.less'


class Bar extends Component {
 state={
  list:[],  //商品分类名称
  productlist:[],//所有商品数据
   countlist:[], //商品分类对应的数量
 
  }


 
  getAlldata=async()=>{
     // 获取所有商品数据
 let res = await callMethodLimitPage(reqProductList,1, [])
  
   this.setState({
    productlist:res.data
   })
   
  //获取商品分类名称及对应的数量
   let data=countdata(this.state.productlist,this.props.categoryList)
    
  this.setState({
    list:data[0],
    countlist:data[1]
  })

  }
 

 componentDidMount(){
  this.getAlldata()
 
 }
  

 
 
  getOption=()=>{
  
    return   {
      title: {
        text: '商品分类统计',
        textStyle:{
          fontSize:24
        },
        left: "center",
        
      },
      legend: {
        data: ['数量'],
        textStyle:{
          fontSize:16
        },
        x:"right",
        y:"top",
        padding:[5,140,30,30]

      },
      xAxis: {
      type: 'category',
      data: this.state.list,
      axisLabel:{
        textStyle:{
          fontSize:16
        }
      }
    },
    yAxis: {
      type: 'value',
      interval:1,
      axisLabel:{
        textStyle:{
          fontSize:16
        }
      }
    },
   
    series: [
      {
        name: '数量',
        data: this.state.countlist,
        type: 'bar',
        barWidth:70,
       
        
      }
    ]
  }
}
  render() {
    return (
      <ReactECharts option={this.getOption()} className='page'/>
    )
  }
}

export default connect(
  state=>({categoryList:state.categoryList,
  productList:state.productList,
  
})
)(Bar)