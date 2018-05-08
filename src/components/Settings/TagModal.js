import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Button, InputNumber } from 'antd';
const FormItem = Form.Item;


class TagModal extends React.Component {

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
        this.props.onOk && this.props.onOk(this.props.model, values);
        this.handleClose();
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
          title={!model.id ? '添加标签' : '编辑标签'}
          visible={true}
          footer={null}>
          <Form>
            <FormItem
              label="标签名称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '名称必须填写' }],
                initialValue: model.name || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="排序"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
              >
              {getFieldDecorator('sort', {
                initialValue: model.sort || 0
              })(<InputNumber />)}
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

export default Form.create()(TagModal)
