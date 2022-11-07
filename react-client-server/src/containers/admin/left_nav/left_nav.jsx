import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link,withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import logo from '../../../static/imgs/logo.png'
import './left_nav.less'
import mapList from '../../../config/menu_config'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'
const { SubMenu } = Menu;
 class LeftNav extends Component {
   
    // 校验菜单权限
    hasAuth=(item)=>{
      // 获取当前用户可以看到的菜单的数组
      const {username,menus}=this.props
      if(username==='admin'){
        return true
      }else if(!item.children){
        return  menus.find((item2)=>{
            return item2===item.key
          })
       }else if(item.children){
       return item.children.some((item3)=>{
        return menus.indexOf(item3.key)!==-1
       })

        }
       }
    
      //  用于创建菜单的函数
    createMenu=(target)=>{
          return   target.map((item1)=>{
            if(this.hasAuth(item1)){
              if(!item1.children){
                return (
                <Menu.Item key={item1.key} onClick={()=>{this.props.saveTitle(item1.title)}}>
               <Link to={item1.path}>
            <Icon type={item1.icon}/>
            <span>{item1.title}</span>
            </Link>
            </Menu.Item>
               )
            }
            else{
                return(
                  <SubMenu
            key={item1.key}
            title={
              <span>
                <Icon type={item1.icon} />
                <span>{item1.title}</span>
              </span>
            }
          >
            {this.createMenu(item1.children)}


          </SubMenu>
                )
            }
            }
                



            })
    }
  render() {
    let {pathname}=this.props.location
    return (
        <div>
            <header className='nav-header'>
                <img src={logo} alt=''/>
                <h1>商品管理系统</h1>
            </header>
        <Menu
          defaultSelectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
          inlineCollapsed={true}
        >
      {this.createMenu(mapList)}





        </Menu>
      </div>
    )
  }
}

export default connect(
    state=>({ username:state.userInfo.user.username,
      menus:state.userInfo.user.role.menus}),
    {
        saveTitle:createSaveTitleAction
    }
)
(withRouter(LeftNav))
