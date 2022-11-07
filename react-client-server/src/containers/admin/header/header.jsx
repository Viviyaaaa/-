import React, { Component } from 'react'
import {Modal,Icon,Button} from 'antd'
import {connect} from 'react-redux'
import  {withRouter} from 'react-router-dom'  // 在非路由组件中，要使用路由组件的api用withRouter
import { compose } from 'recompose'
import './css/header.less'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import {deleteUserInfoAction} from '../../../redux/action_creators/saveUser_action'
import {deleteTitleAction} from '../../../redux/action_creators/menu_action'
import {reqWeather} from '../../../api'
import menuList from '../../../config/menu_config'


const { confirm } = Modal;

class Header extends Component {
  state={
    isFull:false,
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weatherInfo:{},

  }
  // 切换全屏按钮的回调
  fullScreen=()=>{
    screenfull.toggle();
  }
  getWeather=async()=>{
    let res=await reqWeather()
    this.setState({weatherInfo:res})
   



  }
  componentDidMount(){
    // 给screenfull绑定监听
     screenfull.on('change', () => {
     let isFull=!this.state.isFull
     this.setState({isFull})

	});
  this.timer=setInterval(()=>{
            this.setState({
          date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')
        })
     },1000)
     this.getWeather()
     this.getTitle()
}

componentWillUnmount(){
  clearInterval(this.timer)
}
// 点击退出登录的回调
 logOut=()=>{
  let {deleteUserInfo,deleteTitle}=this.props
  confirm({
    title: '确定退出？',
    content: '若退出需要重新登录',
    onOk() {
     deleteUserInfo()
     deleteTitle()
    },
    onCancel() {}
  });
 }

 getTitle=()=>{
  let {pathname}=this.props.location
  let title=''
     let pathKey=pathname.split('/').reverse()[0]
     if(pathname.indexOf('product')!==-1) pathKey='product'
     menuList.forEach((item)=>{
        if(item.children instanceof Array){
          let tmp=item.children.find((citem)=>{
               return citem.key===pathKey
          })
          if(tmp)      title=tmp.title
        }else{
          if(pathKey===item.key){
            title=item.title
          }
        }
     })
     this.setState({title})
 }
  render() {
    let {isFull,weatherInfo}=this.state
    return (
        <div>
        <header className='header'>
           <div className='header-top'>
              <Button  size="small" onClick={this.fullScreen}>
              <Icon  type={isFull?"fullscreen-exit":"fullscreen"}/>
              </Button>
              <span className='username'>欢迎，{this.props.userInfo.user.username}</span>
              <Button  size="small" type="link" onClick={this.logOut}>退出登录</Button>

           </div>
           <div className='header-bottom'>
              <div className='header-bottom-left'>
                {this.props.title||this.state.title}
              </div>
              <div className='header-bottom-right'>
                {this.state.date} &nbsp;
                {weatherInfo.weather} 温度：{weatherInfo.temperature}°C
              </div>
           </div>
        </header>
        </div>
    )



  }

}


export default connect(
  state=>({userInfo:state.userInfo,
  title:state.title}),
  {
    deleteUserInfo:deleteUserInfoAction,
    deleteTitle:deleteTitleAction
  }
)(withRouter(Header))



