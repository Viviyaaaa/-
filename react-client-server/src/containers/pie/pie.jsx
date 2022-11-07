import React, { Component } from 'react'
import {countdata} from '../demo'
import {connect} from 'react-redux'
import {callMethodLimitPage} from '../getAlldata'
import {reqProductList} from '../../api';
import ReactECharts from 'echarts-for-react';
import '../../../src/components/css/index.less'

class Pie extends Component {
  state={
   newlist:[],  //商品分类名称及对应的商品数量
    }
  getAlldata=async()=>{

    // 获取所有商品数据
    let res = await callMethodLimitPage(reqProductList,1, [])
   
      this.setState({
       productlist:res.data
      })
   
      //获取商品分类名称及对应的商品数量
      let data=countdata(this.state.productlist,this.props.categoryList)
     this.setState({
       newlist:data[2]
     })
   
     }
    
   
    componentDidMount(){
     this.getAlldata()
    
    }
  getOption=()=>{

    return {
      title: {
        text: '商品分类统计',
        left: 'center',
        textStyle:{
          fontSize:22
        },
      },
      tooltip: {
        trigger: 'item',
        textStyle:{
          fontSize:14
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle:{
          fontSize:16
        },
        padding:[5,30,30,105]
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '87%',
          data:this.state.newlist,
        center:['50%','55%'],
          label: {
            normal: {
              show: true,
              formatter: '{b}: {c}({d}%)', //自定义显示格式(b:name, c:value, d:百分比),
              textStyle:{
                fontSize:16
              },
            },
           
          },
           emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
)(Pie)