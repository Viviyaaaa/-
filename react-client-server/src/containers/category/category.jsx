import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Form, Card,Button,Icon,Table,message,Modal,Input} from 'antd';
import {reqCategoryList,reqAddCategoryList,reqUpdateCategory} from '../../api'
import { PAGE_SIZE } from '../../config';
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'

 class Category extends Component {

 state={
    categoryList:[],  //商品分类列表
    visible: false, //控制弹窗的展示或隐藏
    operType:'',   //操作类型（新增？修改？）
    isLoading:true, //是否处于加载中
    modelCurrentValue:'',// 弹窗显示的值--用于数据回显
    modelCurrentId:''  //
  }

 // 用于展示弹窗--作为新增
  showAdd = () => {

    this.setState({
      operType:'add',
      visible: true,
      modelCurrentValue:'',
     modelCurrentId:''
    });

  };

  // 用于展示弹窗--作为修改
  showUpdate = (item) => {
    const {_id,name}=item
   
    this.setState({
      operType:'update',
      visible: true,
      modelCurrentValue:name,
      modelCurrentId:_id
    });
  };

 //真正执行新增的操作
  toAdd=async(values)=>{
   let res=await reqAddCategoryList(values)
   let {data,status,msg}=res
   if(status===0){
    message.success('商品添加成功')
    let categoryList=[...this.state.categoryList]
    categoryList.push(data)
      this.setState({categoryList})
      this.setState({
        visible: false,  //隐藏弹窗
      });
      this.props.form.resetFields()  //重置表单
   }else{
    message.error(msg,1)
   }
  }

  toUpdate=async(values1,values2)=>{
    let res=await reqUpdateCategory(values1,values2)
    const {status}=res
    if(status===0){
        message.success('商品修改成功')
        let categoryList=[...this.state.categoryList]
       this.getCategoryList()

       this.setState({
        visible: false,
       })
       this.props.form.resetFields()
    }else{
      message.error('商品更新失败')
    }
  }

  // 点击弹窗ok按钮的回调
  handleOk = () => {
    const {operType}=this.state
    this.props.form.validateFields(async (err, values) => {
      if(err){
        message.error('表单输入有误，请检查',1)
        return
      }


    if(operType==='add') this.toAdd(values)
    if(operType==='update') this.toUpdate(this.state.modelCurrentId,values.categoryName)


 });

  };

   // 点击弹窗取消按钮的回调
  handleCancel = () => {

    this.setState({
      visible: false,
    });
    this.props.form.resetFields()
  };

  // 获取商品分类列表
  getCategoryList=async()=>{
    let res=await reqCategoryList()
    this.setState({isLoading:false})
       const {status,data,msg}=res
       if(status===0){
          this.setState({categoryList:data})
          this.props.saveCategoryList(data)
       }else{
         message.error(msg)
       }
  }
  componentDidMount(){
    this.getCategoryList()
  }
  render() {
    const dataSource = this.state.categoryList
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'name',
        key: 'age',
        width:'25%',
        render:(item)=>{
          return <Button type="link" onClick={()=>this.showUpdate(item)}>修改分类</Button>
        }
      },

    ];
    return (
      <div>
        <Card extra={<Button type="primary" onClick={this.showAdd}><Icon type="plus" />添加</Button>} >
        <Table dataSource={dataSource} columns={columns} bordered pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}} rowKey="_id" loading={this.state.isLoading}/>;

       </Card>
       <Modal
          title={this.state.operType==='add'?'增加分类':'修改分类'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText='取消'
          okText='确定'
        >
         <Form  onSubmit={this.handleSubmit} className="login-form" >
        <Form.Item>
        {getFieldDecorator('categoryName', {
          initialValue:this.state.modelCurrentValue,
            rules: [
              {required: true,message: '分类名必须输入！'},

           ],
          })(
         <Input

              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入分类名"
            />,
            )}
       </Form.Item>
       </Form>

        </Modal>
      </div>
    )
  }
}

export default connect(
  state=>({categoryList:state.categoryList}),
  {
     saveCategoryList:createSaveCategoryAction
  }

)( Form.create()(Category))
