import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect,Route,Switch} from 'react-router-dom'
import {deleteUserInfoAction} from '../../redux/action_creators/saveUser_action'
import { Layout } from 'antd';
import './css/layout.less'
import Home from '../../components/home/home'
import Header from './header/header';
import Category from '../category/category';
import Product from '../product/product';
import User from '../user/user';
import Role from '../role/role';
import Bar from '../bar/bar';
import Line from '../line/line';
import Pie from '../pie/pie';
import LeftNav from './left_nav/left_nav';
import Detail from '../product/detail';
import AddUpdate from '../product/add_update';
const { Footer, Sider, Content } = Layout;

 class Admin extends Component {
  componentDidMount(){
    console.log(this.props)
  }
  logout=()=>{
   this.props.deleteUserInfo()
  }
  render() {
    const {isLogin,user}=this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login"/>

    }else{
       return (
        <Layout className='layout'>
      <Sider className='sider'><LeftNav/></Sider>
      <Layout>
        <Header/>
        <Content className='content'>
          <Switch>
            <Route path="/admin/home" component={Home}></Route>
            <Route path="/admin/prod_about/category" component={Category}></Route>
            <Route path="/admin/prod_about/product" component={Product} exact></Route>
            <Route path="/admin/prod_about/product/detail/:id" component={Detail}></Route>
            <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact></Route>
            <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}></Route>
            <Route path="/admin/user" component={User}></Route>
            <Route path="/admin/role" component={Role}></Route>
            <Route path="/admin/charts/bar" component={Bar}></Route>
            <Route path="/admin/charts/line" component={Line}></Route>
            <Route path="/admin/charts/pie" component={Pie}></Route>
            <Redirect to="/admin/home"></Redirect>
          </Switch>
        </Content>
        <Footer className='footer'>获取最佳用户体验</Footer>
      </Layout>
    </Layout>


    )
    }

  }
}

// 如下代码中的所有key是控制容器组件传递给UI组件的key
// 如下代码中的所有value是控制容器组件传递给UI组件的value
export default connect(
  state=>({userInfo:state.userInfo}),
  {
  deleteUserInfo:deleteUserInfoAction,
  }
)(Admin)







