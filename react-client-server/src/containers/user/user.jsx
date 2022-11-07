import React, { Component,Fragment } from 'react'
import { Button, Card,Icon,Table,Modal,Input,Form, Select,message} from 'antd';
import dayjs from 'dayjs';
import {reqUserList,reqAddUser,reqDeleteUser,reqUpdateUser} from '../../api'
import { PAGE_SIZE } from '../../config';
const { Option } = Select;






 class User extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    userList:[],  //用户列表
    roleList:[],   //角色列表
    username:'',
    password:'',
    phone:'',
    email:'',
    role_id:'',
    isShowAdd:false,  //是否展示新增弹窗
    isShowUpdate:false,
    operType:'',
    _id:'',
    name:'',
   
  };

  getUserList=async()=>{
  let res=await reqUserList()
  const {status,data,msg}=res
  if(status===0){
    this.setState({
      userList:data.users.reverse(),
      roleList:data.roles
    })
  }
  else{
    message.error(msg)
  }
  }

  componentDidMount(){
    this.getUserList()
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
   showAdd=()=>{
    // this.props.form.resetFields()
    this.setState({
      operType:'add',
     isShowAdd: true,
     username:'',
    password:'',
    phone:'',
    role_id:'',
    email:'',
    
    });
   
   }
  addUser=async(values)=>{
    let res=await reqAddUser(values)
    
       const {status,data,msg}=res
       if(status===0){
        message.success('添加用户成功')
        let userList=[...this.state.userList]
        userList.unshift(data)
        this.setState({
          
          userList,
          isShowAdd:false,
          isShowUpdate:false
        })
       }else{
        message.error(msg)
       }
  }

  //新增用户弹窗--确定按钮回调 
  handleOk = e=> {
    const {operType,_id}=this.state
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      
      if(err){
        message.error('表单输入有误，请检查',1)
        return
      }
     if(operType==='add') this.addUser(values)
     if(operType==='update') {
      let result=await reqUpdateUser({...values,_id})
      
     
      const {status}=result
      if(status===0){
          message.success('修改用户成功')
          
         this.getUserList()
  
         this.setState({
         isShowUpdate: false,
         })
         this.props.form.resetFields()
      }else{
        message.error('修改用户失败')
      }
     }

    });
  };

    //新增用户弹窗--取消按钮回调 
  handleCancel = e => {
    
      
   
   
    
    this.setState({
      isShowAdd: false,
      isShowUpdate:false,
    });
     this.props.form.resetFields()
  
  };

  handleSubmit = e => {
   
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  

showUpdate=async(_id)=>{
 

  const {userList}=this.state
   let res=userList.find((item)=>{
          return item._id===_id
   })
   
            
   if(res){
    
     this.setState({
    isShowUpdate:true,
    _id:res._id,
    username:res.username,
    password:res.password,
    phone:res.phone,
    role_id:res.role_id,
    email:res.email,
    operType:'update'
  })
 
  
  
}
}


  

  deleteUser = (item) => {
    return () => {
        const {_id:id} = item;
        Modal.confirm({
            title: '确认删除吗',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const {status, msg} = await reqDeleteUser(id);
                if (status === 0) {
                    message.info('删除成功', 2);
                    this.getUserList();
                } else {
                    message.error(msg, 2);
                }
            }
        });
    }
}

  render() {
    const dataSource = this.state.userList

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '注册时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render:(time)=>{
    return  dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
    }
  },
  {
    title: '所属角色',
    dataIndex: 'role_id',
    key: 'role_id',
    render:(id)=>{
      
      let res=  this.state.roleList.find((item)=>{
          return item._id===id
        })
      if(res) 
      // this.setState({
      //   name:res.name
      // }) 
      return res.name
    }
  },
  {
    title: '操作',
    key: 'option',
    render:(item)=>{
     
      return (
      <Fragment>
          <Button type="link" onClick={()=>{this.showUpdate(item._id);this.props.form.resetFields()}}>修改</Button>
          <Button type="link" onClick={this.deleteUser(item)}>删除</Button>
      </Fragment>
  );
}
  },
];
        const { getFieldDecorator } = this.props.form;
   

    const formItemLayout = {
      labelCol: {
       md: { span:4 },
       
      },
      wrapperCol: {
        
        md: { span: 16 },
      },
    };
   

   
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.showAdd} ><Icon type="plus" />创建用户</Button>}>
       <Table dataSource={dataSource} columns={columns} bordered pagination={{defaultPageSize:PAGE_SIZE}} rowKey="_id"/>;
    </Card>

    <Modal
           title="添加用户"
           visible={this.state.isShowAdd}
           onOk={this.handleOk}
           onCancel={this.handleCancel}
           okText="确认"
          cancelText="取消"
        >
          <Form {...formItemLayout} >
          
        
        
        
        <Form.Item label="用户名">
          {getFieldDecorator('username', {
             initialValue:this.state.username,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入用户名'/>
            
          )}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
             initialValue:this.state.password,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入密码'/>
            
          )}
        </Form.Item>
       
        <Form.Item label="手机号">
          {getFieldDecorator('phone', {
            initialValue:this.state.phone,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入手机号'/>
            
          )}
        </Form.Item>
        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
             initialValue:this.state.email,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入邮箱'/>
            
          )}
        </Form.Item>
        <Form.Item label="角色">
          {getFieldDecorator('role_id', {
            initialValue:'',
            
            rules: [
              { required: true, message: '必须选择一个角色' },
            ],
          })(<Select>
            <Option value=''>请选择一个角色</Option>
            {
              this.state.roleList.map((item)=>{
                return <Option key={item._id} value={item._id}>{item.name}</Option>
              })
            }
            
            
              
             
          </Select>)}
        </Form.Item>
          </Form>
        
        </Modal>


        <Modal
           title="修改用户"
           visible={this.state.isShowUpdate}
           onOk={this.handleOk}
           onCancel={this.handleCancel}
           okText="确认"
          cancelText="取消"
        >
          <Form {...formItemLayout} >
          
        
        
        
        <Form.Item label="用户名">
          {getFieldDecorator('username', {
            initialValue:this.state.username,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入用户名'/>
            
          )}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
             initialValue:this.state.password,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入密码'/>
            
          )}
        </Form.Item>
       
        <Form.Item label="手机号">
          {getFieldDecorator('phone', {
             initialValue:this.state.phone,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入手机号'/>
            
          )}
        </Form.Item>
        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
            initialValue:this.state.email,
            rules: [{ required: true, message: 'Please input website!' }],
          })(
          
              <Input placeholder='请输入邮箱'/>
            
          )}
        </Form.Item>
        <Form.Item label="角色">
          {getFieldDecorator('role_id', {
            initialValue:this.state.role_id||'',
            
            rules: [
              { required: true, message: '必须选择一个角色' },
            ],
          })(<Select >
            {
              this.state.roleList.map((item)=>{
                return <Option key={item._id} value={item._id}>{item.name}</Option>
              })
            }
            
            
              
             
          </Select>)}
        </Form.Item>
          </Form>
        
        </Modal>
       
      </div>
      

    

    )
  }
}

export default (Form.create()(User))
