import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Select, Input, Form,
  Upload, Button, Tree, Checkbox,
  Table, Radio, message, Tooltip } from 'antd';
import {Link} from 'react-router-dom';
import { hasPermission } from '../../utils/common';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

import Icon from '../Icon';
import add from './images/add.svg';
import importt from './images/importt.svg';
import setting from './images/setting.svg';
import Panel from '../Panel';
import Settings from '../Settings';

import './less/index.less';

class CommandArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToggle:false
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleShowPanel = () => {
    this.setState({
      isOpened: true
    })
  }

  handleClose = () => {
    this.setState({
      isOpened: false
    })
  }

  render() {
    return (
      <ul className={ hasPermission() ?'nav three':'nav one' }>
        { hasPermission() &&
          <li onClick={this.props.onAddDocument}>
            <Tooltip title="创建文档"><a href="javascript:void(0)"><Icon glyph={add} /></a></Tooltip>
          </li>
        }
        <li onClick={this.props.onImportDocument}>
          <Tooltip title="导入文档"><a href="javascript:void(0)"><Icon glyph={importt} /></a></Tooltip>
        </li>
        { hasPermission() &&
          <li>
            <Tooltip title="全局设置"><a href="javascript:void(0)" onClick={this.handleShowPanel}><Icon glyph={setting} /></a></Tooltip>

            <Panel
              isOpened={this.state.isOpened}
              title='全局设置'
              onClose={this.handleClose}>
              <Settings />
            </Panel>
          </li>
        }
      </ul>

    );
  }
}


function mapStateToProps(state) {
  var doc = state.document || {};
  return {
    loading: state.loading || {},
    documents: _.chain(doc.list || []).sortBy('sort').value(),
  }
}

export default connect(mapStateToProps)(CommandArea);
