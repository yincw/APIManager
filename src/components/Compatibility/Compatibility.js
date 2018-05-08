import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import Icon from '../Icon';
import chrome from './images/chrome.svg';
import firefox from './images/firefox.svg';
import safari from './images/safari.svg';
import opera from './images/opera.svg';
import explorer from './images/explorer.svg';
// import './less/compatibility.less';
import _ from 'lodash';

class Compatibility extends React.Component {
  static propTypes = {
    value: PropTypes.shape(),
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => { }
  }

  constructor(props) {
    super(props);
    var value = props.value

    this.state = {
      value
    };
  }

  componentWillReceiveProps(nextProps) {
    var { value } = nextProps;
    if (value !== this.props.value) {
      if(!value.chrome && !value.firefox && !value.safari && !value.ie) {
        value = {
          chrome: 'latest',
          firefox: 'latest',
          safari: 'latest',
          opera: 'latest',
          ie: '9+',
        };
      }

      this.setState({ value }, () => {
        this.props.onChange && this.props.onChange(value);
      });
    }
  }

  handleChange = (e) => {
    const value = { ...this.state.value };
    value[e.target.name] = e.target.value;
    this.setState({ value }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  }

  render() {
    var { value } = this.state;
    return (
      <div className="input-group-compatibility">
        <Input name="chrome" value={value.chrome} onChange={this.handleChange}
          addonBefore={  <Icon glyph={chrome} />} />
        <Input name="firefox" value={value.firefox} onChange={this.handleChange}
          addonBefore={<Icon glyph={firefox} />} />
        <Input name="safari" value={value.safari} onChange={this.handleChange}
          addonBefore={<Icon glyph={safari} />} />
        <Input name="opera" value={value.opera} onChange={this.handleChange}
          addonBefore={<Icon glyph={opera} />} />
        <Input name="ie" value={value.ie} onChange={this.handleChange}
          addonBefore={<Icon  glyph={explorer} />} />
      </div>
    );
  }
}

export default Compatibility;
