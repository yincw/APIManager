import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Row, Col, Checkbox,
  Button, Upload, Icon, Select, Switch, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


class TestModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      if(err) {
        return message.error('数据格式错误');
      }

      this.props.form.resetFields();//清空提交的表单 
      var payload = {...this.props.model, ...values };
      this.props.onOk && this.props.onOk({...this.props.model}, {...values});
    })  
  } 

  handleClose = () => {
    this.props.onClose();
    console.log('handleClose', this.props.form.getFieldsValue())
    this.props.form.resetFields();//清空提交的表单 
  }

  render() {
    var model = this.props.model || {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        className='user-modal'
        title='TestModal设置'
        width={this.props.width || 700}
        style={this.props.style}
        visible={true}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}>
        <Form>
          <FormItem
            label="testName"
            {...formItemLayout}>
            {getFieldDecorator('platformName', {
              rules:[{required:true, message:'排序值不能为空'}],
              initialValue: model.platformName || '',
            })(<Input />)}
          </FormItem>
          <FormItem
            label="sortCode"
            {...formItemLayout}>
            {getFieldDecorator('sortCode', {
              rules:[{required:true, message:'排序值不能为空'}],
              initialValue:  model.sortCode || 1
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}


export default Form.create()(TestModal)