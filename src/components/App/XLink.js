import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import logo from './images/logo.svg';
import Panel from '../Panel';
import Log from '../Log';

import AboutModal from './AboutModal';

class XLink extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      aboutModalVisible:false
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleShowAbout = () => {
    this.setState({
      aboutModalVisible: true
    })
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
      <div className="welcome">
        <div className="info">
          <Icon glyph={logo} />
          <h1>APIManager</h1>
        </div>
        <ul className="link">
          <li>
            <a href="javascript:void(0)" onClick={this.handleShowPanel}>更新日志</a>
            <Panel
              isOpened={this.state.isOpened}
              title='更新日志'
              onClose={this.handleClose}>
              <Log />
            </Panel>
          </li>
          <li>
            <a href="javascript:void(0)" onClick={this.handleShowAbout}>关于</a>
          </li>
        </ul>
        <AboutModal
          visible={this.state.aboutModalVisible}
          onClose={() => {this.setState({aboutModalVisible:false})}} />
      </div>
    )
  }
}


export default XLink;
