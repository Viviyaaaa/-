import React, { Component } from 'react'
import { Button, Card,Icon,Table,Modal,Input,Form, message,Tree} from 'antd';
import dayjs from 'dayjs';
import {connect} from 'react-redux'
import {reqRoleList,reqAddRole,reqUpdateRole} from '../../api'
import menuList from '../../config/menu_config'


const { TreeNode } = Tree;

const treeData = menuList

class Role extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  state={
    isShowAdd:false,
    isShowAuth:false,
    roleList:[],
   checkedKeys: [],  //选中的菜单
   _id:''  //当前操作的角色id
    
  }

  getRoleList=async ()=>{
    let res=await reqRoleList()
        const {status,data,msg}=res
       
        if(status===0){
          this.setState({
            roleList:data
          })
        }
  }
 
 componentDidMount(){
  this.getRoleList()
  
 }

//  新增角色--确认按钮
  handleOk = () => {
    this.props.form.validateFields(async (err, values) => {


      if (!err) {
        
         let res=await reqAddRole(values)
        
         const {status,data,msg}=res
         if(status===0){
          message.success('新增角色成功')
          this.getRoleList()
          this.setState({
            isShowAdd:false
          })
         }else{
          message.error(msg)
         }
      }
    })
  };

  // 新增角色--取消按钮
  handleCancel = e => {
    
    this.setState({
      isShowAdd:false
    });
  };

  // 用于展示新增弹窗
  showAdd=()=>{
    this.props.form.resetFields()
    this.setState({
      isShowAdd:true
    })
  }

  // 用于展示授权弹窗
  showAuth=(_id)=>{
    const {roleList}=this.state
   let res= roleList.find((item)=>{
      return item._id===_id
    })
    if(res){
      this.setState({checkedKeys:res.menus})
    }
    this.setState({
      _id,
      isShowAuth:true
    })
  }

  // 授权弹窗--确认按钮
  handleAuthOk=async()=>{
    
   let res=await reqUpdateRole({_id:this.state._id,menus:this.state.checkedKeys,auth_name:this.props.userInfo})
   
   const {data,status,msg}=res
   if(status===0){
    message.success('授权成功',1)
    this.setState({
      isShowAuth:false
    })
    this.getRoleList()
   }else{
    message.error(msg)
   }
  }

  // 授权弹窗--取消按钮
  handleAuthCancel=()=>{
    this.setState({isShowAuth:false})
  }


 

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

 
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  render() {
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.state.roleList
    
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render:(time)=>{return dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')}
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render:(time)=>time?dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'):''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
       
        key: 'option',
        render:(item)=> <Button type="link" onClick={()=>{this.showAuth(item._id)}}>设置权限</Button>
        
        
      },
    ];
    
    return (
      <div>
        <Card title={<Button type="primary" onClick={()=>{this.showAdd()}}><Icon type="plus" />新增角色</Button>}>
        
      <Table dataSource={dataSource} columns={columns} bordered pagination={{defaultPageSize:5}} rowKey="_id"/>;
    </Card>
    {/* 新增角色提示框 */}
    <Modal
          title="新增角色"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
         <Form onSubmit={this.handleOk} className="login-form">
        <Form.Item>
          {getFieldDecorator('roleName', {
            rules: [{ required: true, message: '请输入角色名称' }],
          })(
            <Input
              
              placeholder="请输入角色名称"
            />,
          )}
        </Form.Item>
        </Form>
        {/*设置权限弹窗  */}
        </Modal>
        <Modal
          title="分配权限"
          visible={this.state.isShowAuth}
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
          okText="确认"
          cancelText="取消"
        >
         <Tree
        checkable  //允许选中
       
         onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys} //一上来就展开谁
        defaultExpandAll   //展开所有节点
        
      >
        <TreeNode title="平台功能" key="top" >
            {this.renderTreeNodes(treeData)}
          </TreeNode>
        
      </Tree>
        </Modal>
      </div>
      
    
    )
  }
}

export default connect(
  state=>({userInfo:state.userInfo.user.username}),
  {

  },
)(Form.create()(Role))

