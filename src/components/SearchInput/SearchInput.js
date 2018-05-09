import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import './less/searchInput.less';
import { Select, Button, AutoComplete } from 'antd';
import { getName } from '../../utils/common';

import _ from 'lodash';
const Option = Select.Option;

class SearchInput extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    this.timeout = null;
  }

  handleChange = (value) => {
    value = (value || '').trim();

    if(value == '') {
      return this.setState({
        value
      })
    };

    this.setState({
      value:value,
      isSearching:true,
    }, () => {
      this.props.dispatch({type:'api/reqSearchApis', payload:{name:value}});
    });
  }

  handleFocus =() => {
    this.setState({
      value:'',
      isSearching:true,
    });
  }

  handleBlur = () => {
    this.setState({
      isSearching:false,
    });
  }

  renderCtrl = () => {
    return this.props.apis.map(d => {
      d.parentNode = {
        id: d.document_id,
        name:d.document_name
      }
      return <Option
        key={d._id} api={d}
        value={getName(d, d.parentNode)}>
        {getName(d, d.parentNode)}
      </Option>
    })
  }

  render() {
    return (
      <div style={{position:'relative'}}>
        <Select
          allowClear
          mode="combobox"
          value={this.state.value}
          placeholder='输入关键字'
          style={{width:180}}
          notFoundContent='搜索结果为空'
          onFocus={this.handleFocus }
          onBlur={this.handleBlur}
          onSelect ={this.props.onSelect}
          onChange={_.throttle(this.handleChange, 500)}>
          {this.renderCtrl()}
        </Select>
      </div>
    );
  }
}

function mapStateToProps(state) {
  var x = state.api.searchApis || [];
  x = _.uniqBy(x, 'name');
  return { apis: x.splice(0,10) }
}

export default connect(mapStateToProps)(SearchInput);
