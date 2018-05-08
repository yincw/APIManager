import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Row, Col, Checkbox,
  Button, Upload, Icon, Select, Switch } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;


class NormalModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleOk = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      if(!err){  
        this.props.form.resetFields();//清空提交的表单 
        this.props.onCreateOrUpdate({...this.props.model}, {...values });
      }  
    })  
  } 

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  renderChildren = () => {
    var  { model } = this.props;
    model = model || {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutx = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const formItemLayoutxx = {
      labelCol: { span: 2 },
      wrapperCol: { span: 7 },
    };
    
    var childrenDataSource = this.props.childrenDataSource || [];

    return childrenDataSource.map(each => {
      return (
        <FormItem
          label={each.label}
          {...formItemLayout}>
          {getFieldDecorator(each.key, each.fieldDecorator)(<Input />)}
        </FormItem>
      )
    })
  }

  render() {
    
    return (
      <div>
        <Modal
          className='user-modal'
          title={this.props.title}
          width={this.props.width || 700}
          style={this.props.style}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.props.onCancel}>
          <Form>
            {this.renderChildren()}
          </Form>
        </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
  }
}

export default Form.create()(NormalModal);