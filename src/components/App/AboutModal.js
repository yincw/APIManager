import fs from 'fs-extra';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Input, Form, Button, Upload, Select, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
import Icon from '../Icon';
import logo from './images/logo.svg';


if (process.env.electronMode === 'dev' || process.env.electronMode === 'preview') {
  var config = fs.readJsonSync('package.json', {encoding:'utf8'});
} else {
  var config = fs.readJsonSync(path.join(process.resourcesPath, 'app', 'package.json'), {encoding:'utf8'});
}

class AboutModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {

    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.onClose}
        footer={null}>
        <div className="view-about">
          <Icon glyph={logo} />
          <p className="name">API 文档管理平台</p>
          <p className="version">{`v${config.version}`}</p>
          <ul className="developer">
            <li>开发者：</li>
            <li>@yincw</li>
            <li>@simple0812</li>
          </ul>
          <p className="copyright">&copy; 2018 福禄网络 UED 保留所有权利</p>
        </div>
      </Modal>
    );
  }
}

export default AboutModal;
