import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin } from 'antd';

// import './less/default.less';

class SteamTemplate extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
  }


  componentWillMount() {
  }

  render() {
    return (
     <div className='workflow-container'>
        <div className='workflow-container-header'>
          <div className='workflow-container-search'>
            {this.props.placeholder0}
          </div>
          <div className='workflow-container-cmd'>
            {this.props.placeholder1}
          </div>
        </div>
        <div className='workflow-container-content'>
          {this.props.placeholder2}
        </div>
        {this.props.placeholder3}
      </div>
    );
  }
}

export default SteamTemplate;
