import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Button, Upload, Icon, Select } from 'antd';
import { remote } from 'electron';
import path from 'path';
var fs = window.require('fs');
const uuidv1 = require('uuid/v1');
const process = remote.process;
import semver from 'semver';
import { directory } from '../../../.vd/project.json';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


class DocumentModal extends React.Component {
  constructor(props) {
    super(props);
  }

  uploadProps = {
    name: 'icon',
    accept:'.jpg, .png, .jpeg',
    headers: {
    },
    fileList:[],

    beforeUpload: () => false,

  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  checkVersion = (rule, value, callback) => {
    if (semver.valid(value) === null) {
      callback('请输入格式正确的版本号!');
    } else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err,values)=>{
      if(err) {
        remote.app.logger.warning(err.message);
        return ;
      }

      let src = values.icon;

      //需要判断icon是否被修改了 如果被修改了则包含全路径 否则只有文件名
      if(src.indexOf('/') > -1 || src.indexOf('\\') > -1) {
        var filename = uuidv1() + path.extname(src);
        values.icon =  filename;

        var readStream = fs.createReadStream(src);

        if (process.env.electronMode === 'dev' || process.env.electronMode === 'preview') {
          // 开发模式
          // 预览模式，打包前确认
          if(!fs.existsSync(path.join(directory.production.envName, 'assets')))
            fs.mkdirSync(path.join(directory.production.envName, 'assets'))
          var dest = path.join(directory.production.envName, 'assets', filename);
        } else {
          // 打包模式
          if(!fs.existsSync(path.join(process.resourcesPath, 'app', 'dist', 'assets')))
            fs.mkdirSync(path.join(process.resourcesPath, 'app', 'dist', 'assets'))
          var dest = path.join(process.resourcesPath, 'app', 'dist', 'assets', filename);
        }

        var writeStream = fs.createWriteStream(dest);
        readStream.pipe(writeStream);
      }
      
      this.props.onOk && this.props.onOk(this.props.model, values);
    })
  }

  normFile = (e) => {
    if (!e.file) return '';
    if(e.file.path) return e.file.path;
    if(e.file.originFileObj) return e.file.originFileObj.path;

    return '';
  }

  handleClose = () => {
    this.props.onClose();
    this.props.form.resetFields();//清空提交的表单
  }

  renderIcon = () => {

    let doc = this.props.form.getFieldsValue();
    if(!doc || !doc.icon) return <span></span>;
    var pathname = doc.icon;

    //已经设置的图像
    if(doc.icon.indexOf('/') == -1 && doc.icon.indexOf('\\') == -1) {
      pathname = path.join('assets', doc.icon)
      return <img src={ pathname } style={{width:25, height:25, marginLeft:'5px'}} id='doc_icon' />
    }

    var x = fs.readFileSync(doc.icon, 'base64');
    return <img src={ 'data:image/png;base64,' + x } style={{width:25, height:25, marginLeft:'5px'}} id='doc_icon' />
  }

  initLangs = ()=> {
    return this.props.languages.map((each) => {
      return <Option key={each.id} dataref={each} value={each.id}>{each.name}</Option>
    })
  }

  initGroups = ()=> {
    return this.props.documentGroups.map((each) => {
      return <Option key={each.id} dataref={each} value={each.id}>{each.name}</Option>
    })
  }

  normSelect = (e) => {
    return _.last(e);
  }

  handleLanguageChange = (key, evt) => {
    var dataref = evt.props.dataref;
    this.props.form.setFieldsValue({language:dataref.name});
  }

  render() {
    const { model } = this.props;
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator('language',  {
      initialValue:  model.language || ''
    }); //注册language字段

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
      <Modal
        title={!model.id ? '创建文档' : '编辑文档'}
        visible={true}
        onCancel={this.handleClose}
        footer={null}>
        <Form>
          <FormItem
            label="从属语言"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}>
            {getFieldDecorator('language_id', {
              rules: [{ required: true, message: '从属语言不能为空' }],
              initialValue:  model.language_id || ''
            })(<Select onSelect={this.handleLanguageChange}>
              {this.initLangs()}
            </Select>)}
          </FormItem>
          <FormItem
            label="分组"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}>
            {getFieldDecorator('group_id', {
              rules: [{ required: true, message: '分组不能为空' }],
              initialValue:  model.group_id || ''
            })(<Select>
              {this.initGroups()}
            </Select>)}
          </FormItem>
          <FormItem
            label="名称"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            >
           {getFieldDecorator('name', {
              rules: [{ required: true, message: '名称不能为空' }],
              initialValue:  model.name || ''
            })(<Input />)}
          </FormItem>
          <FormItem
            label="版本"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            >
            {getFieldDecorator('version', {
                rules: [
                  {
                  required: true,
                  message: '版本不能为空',
                  // pattern: /^[0-9]+\.[0-9]+\.[0-9]+(\.[0-9]+)?$/,
                },
                { validator: this.checkVersion, }
                ],
                initialValue:  model.version || '1.0.0'
              })(<Input />)}
          </FormItem>
          <FormItem
            label="图标"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            >
            {getFieldDecorator('icon', {
                valuePropName: 'file',
                getValueFromEvent: this.normFile,
                rules: [{
                  validator:(rule, value, cb) => {
                  return cb();}
                }],
                initialValue:  model.icon || '',

              })(<Upload {...this.uploadProps}>
                <div>
                  <Button>
                    <Icon type="upload" /> 上传
                  </Button>
                  {
                    this.renderIcon()
                  }
                </div>
              </Upload>)}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
              保 存
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  var lang = state.language || {};
  var documentGroup = state.documentGroup || {};
  return {
    languages: _.sortBy(lang.list || [], 'sort'),
    documentGroups: _.sortBy(documentGroup.list || [], 'sort'),
  }
}

export default connect(mapStateToProps)(Form.create()(DocumentModal));
