/* eslint react/no-string-refs: 0 */
import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Card,Form,Input,Icon,Select,Button, message} from 'antd';
import './add_update.less'
import { reqCategoryList,reqAddProduct,reqUpdateProduct} from '../../api';
import PicturesWall from './picture_wall'
import RichTextAditor from './rich_text_aditor'
const { Option } = Select;

 class AddUpdate extends Component {
  state = {
    categoryList:[],   //商品分类列表
    operaType:'add',
    categoryId :'',
    pCategoryId:'',
    name:'',
    desc:'',
    price :'',
    detail:'',
    imgs:[],
    _id:'',
    
  };
  getCategoryList=async()=>{
      let res=await reqCategoryList()
      const {status,data,msg}=res
      if(status===0){
        this.setState({
          categoryList:data
        })
      }else{
        message.error(msg)
      }
  }
componentDidMount(){
  const {categoryList,productList}=this.props

  const {id}=this.props.match.params
  if(id){
    this.setState({
      operaType:'update'
    })
    if(productList.length){
    let res=productList.find((item)=>{
     return item._id===id
    })
    if(res){
      this.setState({...res})
      this.pictureWall.setImgArr(res.imgs)
      this.textAditor.setRichTextAditor(res.detail)
    }
    
  }
  
  }
  if(categoryList.length){
    this.setState({
    categoryList
  })
  }else{
    this.getCategoryList()
  }


}
  handleSubmit = e => {
    e.preventDefault();
    //从上传组件中获取已经上传的图片数组
      let imgs=this.pictureWall.getImgArr()
      // 从富文本组件中获取用户输入的文字转换为富文本的字符串
      let detail=this.textAditor.getRichTextAditor()
      const {_id}=this.state
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
           let res
        if(this.state.operaType==='add'){
            res=await reqAddProduct({...values,imgs,detail})
        }else{
          res=await reqUpdateProduct({...values,imgs,detail,_id})
        }
         
        const {status,data,msg}=res
      
        if(status===0){
          message.success('添加商品成功')
          this.props.history.replace('/admin/prod_about/product')
        }else{
          message.error(msg)
        }
        console.log('Received values of form: ', {...values,imgs,detail});
      }
    });
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


  render() {
    const { getFieldDecorator } = this.props.form;
     

    const formItemLayout = {
      labelCol: {
        md: { span: 2 },

      },
      wrapperCol: {
        md: { span: 7},

      },
    };





    return (
      <Card title={
        <div className='left'>
          <Button type="link" size="small" onClick={()=>{this.props.history.push('/admin/prod_about/product')}}>
             <Icon type="arrow-left" style={{fontSize:'20px'}} />
          </Button>

         <span>{this.state.operaType==='add'?'商品添加':'商品修改'}</span>
        </div>

      } >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="商品名称">
          {getFieldDecorator('name', {
            initialValue: this.state.name||'',
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input  placeholder='商品名称'/>)}
        </Form.Item>
        <Form.Item label="商品Id">
          {getFieldDecorator('categoryId', {
              initialValue: this.state.categoryId||'',
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input  placeholder='商品Id'/>)}
        </Form.Item>
        <Form.Item label="商品描述">
          {getFieldDecorator('desc', {
           initialValue: this.state.desc||'',
            rules: [
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input  placeholder='商品描述'/>)}
        </Form.Item>

        <Form.Item label="商品价格">
          {getFieldDecorator('price', {
            initialValue: this.state.price||'',
            rules: [{ required: true, message: 'Please input your phone number!',
           }],
          })(<Input addonBefore={'￥'} addonAfter={'元'} style={{ width: '100%' }}  placeholder='商品价格'/>)}
        </Form.Item>

        <Form.Item label="商品分类">
          {getFieldDecorator('pCategoryId', {
            initialValue: this.state.pCategoryId||'',
            
            rules: [
              { required: true, message: 'Please select your habitual residence!' },
            ],
          })(<Select>

             {
              this.state.categoryList.map((item)=>{
                return (<Option value={item._id} key={item._id}>{item.name}</Option>)
              })
             }
          </Select>)}
        </Form.Item>
        <Form.Item label="商品图片" wrapperCol={{md:8}}>
         <PicturesWall ref={(wall) => this.pictureWall = wall}/>
        </Form.Item>
        <Form.Item label="商品详情" wrapperCol={{md:16}}>
          <RichTextAditor ref={(aditor) => this.textAditor = aditor}/>
        </Form.Item>
        <Button type="primary" htmlType='submit'>提交</Button>
      </Form>
    </Card>
    )
  }
}


export default connect(
  state=>({categoryList:state.categoryList,
  productList:state.productList})
)(Form.create()(AddUpdate))
