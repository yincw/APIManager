import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Button, Upload, Radio, Icon, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
import DocumentModal from './DocumentModal';
import GroupModal from './GroupModal';
import Panel from '../Panel';
import Compatibility from '../Compatibility';
import ReactMde, { ReactMdeCommands, ReactMdeTypes } from 'react-mde';
import * as Showdown from "showdown";
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash';

// import '../../assets/css/font-awesome.css';
// import '../../assets/fonts/fontawesome-webfont.eot';
// import '../../assets/fonts/fontawesome-webfont.svg';
// import '../../assets/fonts/fontawesome-webfont.ttf';
// import '../../assets/fonts/fontawesome-webfont.woff';
// import '../../assets/fonts/fontawesome-webfont.woff2';


function setCursorPosition(elem, index) {
    var val = elem.value
    var len = val.length

    // 超过文本长度直接返回
    if (len < index) return
    setTimeout(function() {
        elem.focus()
        if (elem.setSelectionRange) { // 标准浏览器
            elem.setSelectionRange(index, index)
        } else { // IE9-
            var range = elem.createTextRange()
            range.moveStart("character", -len)
            range.moveEnd("character", -len)
            range.moveStart("character", index)
            range.moveEnd("character", 0)
            range.select()
        }
    }, 10)
}

class ApiPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        mdeStateX:null,
        mdeState: null,
    };
    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
  }

  componentWillMount() {
    const { dispatch, model } = this.props;
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(!err){
        values.type = 'api';
        if(values.code && _.has(values.code, 'markdown')) {
          values.code  = values.code.markdown;
        }

        if(values.refer_to && _.has(values.refer_to, 'markdown')) {
          values.refer_to  = values.refer_to.markdown;
        }

        if(values.compatibility) {
          values.compatibility = JSON.stringify(values.compatibility)
        }

        this.props.onOk && this.props.onOk(this.props.model, values);
      }
    })
  }

  handleClose = () => {
    this.props.onClose();
    this.props.form.resetFields();//清空提交的表单
  }

  initTags = ()=> {
    var tags = _.sortBy(this.props.tagsOfDocument, 'sort');
    return tags.map((each) => {
      return <Option key={each.id} value={each.id}>{each.name}</Option>
    })
  }

  textAreaProps ={
    id:'mdEditorArea',
    onBlur: function(evt) {
    },
    onFocus: function(evt) {
    },
  }

  handleChange =(evt)=> {
  }

  getCommands = () => {
    var cmds = ReactMdeCommands.getDefaultCommands()
    cmds = cmds.map(each => {
      each = _(each).reject(item => item.icon == 'heading' || item.icon == 'link'|| item.icon == 'image')

      return each;
    })

    return cmds;
  }

  handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
    this.setState({mdeState});
  }

   handleValueChangex = (mdeState: ReactMdeTypes.MdeState) => {
    this.setState({mdeStateX:mdeState});
  }

  render() {
    var model = this.props.model || {};
    var parentNode = this.props.parentNode || {};
    var documentNode = parentNode;
    if(documentNode.document_id) {
      documentNode = this.props.documents.find(each => each.id == documentNode.document_id) || {};
    }
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
        <Panel
          isOpened={this.props.isOpened}
          title={model.id ? '编辑 API': '添加 API'}
          onClose={this.handleClose}>
          <div className="view-api">
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}>
            <Form>
              <FormItem
                label="名称"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'API名称必须填写' }],
                  initialValue: model.name
                })(<Input />)}
              </FormItem>
              <FormItem
                label="类型"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                >
                {getFieldDecorator('object_type', {
                  rules: [{ required: true, message: 'API类型必须填写' }],
                  initialValue:  model.object_type || 0
                  })(<RadioGroup>
                    <Radio value={0}>无</Radio>
                    <Radio value={1}>原型方法</Radio>
                    <Radio value={2}>静态方法</Radio>
                    <Radio value={3}>原型属性</Radio>
                    <Radio value={4}>静态属性</Radio>
                    <Radio value={5}>对象</Radio>
                  </RadioGroup>
                )}
              </FormItem>

              {(parentNode.group_type !== 'class' &&
              (this.props.form.getFieldsValue().object_type === 2
                || this.props.form.getFieldsValue().object_type === 4)) &&
                <FormItem
                  label="静态类型名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                  >
                  {getFieldDecorator('class_name', {
                    rules: [{ required: true, message: 'API静态类型名称必须填写' }],
                    initialValue: model.class_name || ''
                  })(<Input />)}
                </FormItem>
              }

              <FormItem
                label="标签"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                >
                {getFieldDecorator('tags', {
                  initialValue:  this.props.tagsOfApi.map(each => each.id) || []
                })(<Select mode="multiple">
                    {this.initTags()}
                  </Select>)}
              </FormItem>

              <FormItem
                label="API 状态"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '库版本必须填写' }],
                  initialValue:  model.status || 1
                })(<RadioGroup>
                  <Radio value={1}>当前(current)</Radio>
                  <Radio value={2}>新增(new)</Radio>
                  <Radio value={3}>废弃(deprecated)</Radio>
                </RadioGroup>)}
              </FormItem>
              <FormItem
                label="用法"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                >
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: 'Please input your note!' }],
                  getValueFromEvent: (evt) => {return evt;},
                  valuePropName:'editorState',
                  initialValue:{
                    markdown:model.code || ''
                  }
                })(
                  <ReactMde
                    layout='noPreview'
                    generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
                />
                )}
              </FormItem>
              <FormItem
                label="发布模块状态"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('release_status', {
                  initialValue:  model.release_status || ''
                })(<Input />)}
              </FormItem>
              <FormItem
                label="发布文档版本"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('document_version', {
                  initialValue:  model.document_version || documentNode.version || ''
                })(<Input />)}
              </FormItem>
              <FormItem
                label="文档成熟度"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('version_status', {
                  rules: [{ required: true, message: '文档成熟度必须填写' }],
                  initialValue: model.version_status || 1
                })(
                  <RadioGroup>
                    <Radio  value={1}>工作草案(WD，Working Draft)</Radio>
                    <Radio  value={2}>候选推荐(CR，Candidate Recommendation)</Radio>
                    <Radio  value={3}>推荐(REC，Recommendation)</Radio>
                  </RadioGroup>)}
              </FormItem>
              <FormItem
                label="兼容性"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('compatibility', {
                  initialValue:  _.isString(model.compatibility || '{}')?JSON.parse(model.compatibility || '{}'): model.compatibility,
                })(<Compatibility />)}
              </FormItem>
              <FormItem
                label="参考文献"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}>
                {getFieldDecorator('refer_to', {
                  getValueFromEvent: (evt) => {return evt;},
                  valuePropName:'editorState',
                  initialValue:{
                    markdown:model.refer_to || ''
                  }
                })(
                <ReactMde
                  layout='noPreview'
                  generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))} />
                )}
              </FormItem>
              <FormItem
                wrapperCol={{ span: 12, offset: 4 }}>
                <Button type="primary" onClick={this.handleSubmit} htmlType="submit" className="mr10">
                  保 存
                </Button>
                <Button onClick={this.handleClose}>取 消</Button>
              </FormItem>
            </Form>
        </Scrollbars>
        </div>
        </Panel>
    );
  }
}

function mapStateToProps(state) {
  var tag = state.tag || {};
  var api = state.api || {};
  var doc = state.document || {};
  return {
    apis: api.list || [],
    documents: doc.list || [],
    tagsOfApi: tag.tagsOfApi || [],
    tagsOfDocument: tag.tagsOfDocument || [],
  }
}

export default connect(mapStateToProps)(Form.create()(ApiPanel));
