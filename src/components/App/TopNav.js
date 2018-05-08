import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Select, Input, Form,
  Upload, Button, Tree, Checkbox, Icon,
  Table, Radio, message, Tooltip } from 'antd';
import { windowUtil } from '../../utils/windowUtil';
import { remote } from 'electron';


class TopNav extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleMax = () => {
    var win = remote.getCurrentWindow();
    windowUtil.maxWindow(!win.isMaximized());
  }

  handleClose = () => {
    remote.getCurrentWindow().destroy()
  }

  handleMin = () => {
    windowUtil.minWindow();
  }


  render() {
    return (
       <div className="topnav">
          <div className='close_area' onDoubleClick={this.handleClose}>
          </div>
          <div className='navcmd'>
            <Icon className='quit_cmd' type="close" onClick={this.handleClose} ></Icon>
            <Icon className='max_cmd' type="laptop" onClick={this.handleMax}  ></Icon>
            <Icon className='min_cmd' type="minus" onClick={this.handleMin} ></Icon>
          </div>
      </div>
    );
  }
}

export default TopNav