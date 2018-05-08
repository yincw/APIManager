import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin } from 'antd';

class DefaultTemplate extends React.Component {
  static propTypes = {
  }
  
  constructor(props) {
    super(props);
  }


  componentWillMount() {
  }


  render() {
    return (
     <div style={{width:'100%', height:'100%'}}>
      <div style={{width:200, height:400, float:'left', background:'red'}}>
        aaa
        {this.props.placeholder0}
      </div>
      <div style={{width:400, height:400,float:'left', background:'yellow'}}>
        bbb
        {this.props.placeholder1}
        ccc
        {this.props.placeholderx}

      </div>
     </div>
    );
  }
}

export default DefaultTemplate;
