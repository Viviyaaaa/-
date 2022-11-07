import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom';
import  {reqLogin} from '../../api'


import {saveUserInfoAction} from '../../redux/action_creators/saveUser_action'
import logo from '../../static/imgs/logo.png'
import './css/login.less'
class Login extends Component {
  // componentDidMount(){
  //   console.log(this.props)
  // }

  // 点击登录的回调
  handleSubmit = e => {
    e.preventDefault(); //阻止默认事件-禁止form表单提交--通过ajax发送
    this.props.form.validateFields(async (err, values) => {
      // values的值是：{username:xxx,password:yyyy}
         const {username,password}=values
      if (!err) {
        //  若用户输入无错误，发送登录请求
        let res=await reqLogin(username,password)
        // 从响应中获取：请求状态、错误信息、数据
         const {status,msg,data}=res
         console.log(res)
         // 判断登录是否成功
        if(status===0){
    
    // 服务器返回的user信息，交由redux管理
     this.props.saveUserInfo(data)
      // 跳转admin页面
    this.props.history.replace('/admin')
    
        }else{
          message.warn(msg)
        }
      }
      else{
         message.error('表单输入错误，请检查')
        }

    // axios.post('http://localhost:3001/login',values)
    // .then((result)=>{
    //    console.log(result.data)
    // })
    // .catch((reason)=>{
    //   console.log('失败了')
    // })

    });
  };

  // 密码的验证器
 pwdValidator=(rule, value, callback)=>{
  if(!value){
    // 提示密码必须输入
callback('密码不能为空!')
  }
     else if(value.length<4){
       // 提示密码必须小于等于4位
      callback('密码必须大于等于4位')
     }else if(value.length>12){
      // 提示密码必须小于等于12位
      callback('密码必须小于等于12位')
     }else if(!(/^\w+$/).test(value)){
       // 提示密码必须英文、数字或下划线组成
      callback('密码必须是英文、数字或下划线组成')
     }else{
     callback()
     }
}
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLogin } = this.props;
      
    // 如果用户已经登陆, 自动跳转到 admin
    if(isLogin){
     return <Redirect to="/admin/home"/>
    }
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form  onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
        {getFieldDecorator('username', {

            rules: [
              {required: true,message: '用户名必须输入！'},
              {min:4,message:'用户名必须大于等于4位'},
                {max:12,message:'用户名必须小于等于12位'},
                {pattern:/^\w+$/,message:'用户名必须是英文、数字或下划线组成'}
           ],
          })(
         <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
            )}
       </Form.Item>
        <Form.Item>
        {getFieldDecorator('password', {
            rules: [{ validator:this.pwdValidator}],
          })(
          <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
            )}
         </Form.Item>
        <Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
         </Form.Item>
        </Form>
 </section>
      </div>
    )

  }
}

// 1.暴露的根本不是我们定义的Login组件，而是经过加工（包装）的Login组件。
// 2.Form.create()调用返回一个函数，该函数加工了Login组件，生成了一个新组件，新组件实例对象的props多了


export default connect(
  state=>({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:saveUserInfoAction,

  }
)( Form.create()(Login))







