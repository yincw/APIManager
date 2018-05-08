import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin } from 'antd';

import _ from 'lodash';
import resolverFactory from './resolvers/factory';
import DefaultTemplate from './templates/default';

class RRender extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
  }

  initCtrl = () => {
    var _this = this;
    var dataSource = this.props.dataSource || {};
    var template = this.props.template || DefaultTemplate;

    var elements = _.sortBy(dataSource.elements || [] , 'sort');
    var placeholder = {};

    for(var i =0; i< elements.length; i++) {
      var each = elements[i] || {};

      if(!each.type) {
        continue ;
      }

      var position = 'placeholder' + (each.position || 0);
      placeholder[position] = placeholder[position] || [];

      var Resolver = resolverFactory.create(each.type);
      if(!Resolver) {
        continue;
      }

      var key = `${position}-${each.sort || 0}-${i}`;
      var xEle = new Resolver(dataSource, template, key).resolve(each, _this);

      if(xEle) {
        placeholder[position].push(xEle);
      }

    }

    return React.createElement(template, {...placeholder} );
  }

  render() {
    return (
     <div className="rrender">
     {
        this.initCtrl()
     }
     </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(RRender);
