import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Button, Upload, Icon, Select, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

class GroupModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values) => {
      if(!err){
        values.type = 'group';
        this.props.onOk && this.props.onOk(this.props.model, values);
      }
    })
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
    this.props.form.resetFields();//清空提交的表单
  }

  render() {
    const { model } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          onCancel={this.handleClose}
          title={!model.id ? '添加分组' : '编辑分组'}
          visible={true}
          footer={null}>
          <Form>
            <FormItem
              label="名称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '分组名称必须填写' }],
                initialValue: model.name || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="特性"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}>
              {getFieldDecorator('group_type', {
                rules: [{}],
                initialValue: model.group_type || 'class'
              })(<RadioGroup>
                <Radio value='class'>类型</Radio>
                <Radio value='collection'>归档</Radio>
              </RadioGroup>)}
            </FormItem>
            <FormItem
              wrapperCol={{ span: 12, offset: 5 }}>
              <Button type="primary" onClick={this.handleSubmit} htmlType="submit">
                保 存
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(GroupModal)
