import React from 'react';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin } from 'antd';
import _ from 'lodash';

export default  class BaseResolver  {
  constructor(dataSource, template, key) {
    this.dataSource = dataSource;
    this.template = template;
    this.key = key;
  }

  elementMap = {
    input:Input,
    button:Button,
    modal:Modal,
    table:Table,
    datePicker:DatePicker,
    select:Select,
  }

  resolve = (each, _this) => {
    each.data = each.data || {};

    var ele = null;
    if(_.isString(each.type)) {
      ele = this.elementMap[each.type];
    } else if(_.isObject(each.type) && !_.isArray(each.type)) {
      ele = each.type
    }

    if(!ele) {
      return null;
    }

    // var xEle = React.createElement(ele, {key:Math.random()});

    var xProps = {...each.data };

    each.events = each.events || {};

    for(var key in each.events) {
      var evtName = each.events[key];
      if(evtName && _this.props[evtName]) {
        xProps[key] = _this.props[evtName].bind(null, xEle, _this,...arguments)
      }
    }

    var xEle = React.createElement(ele, {...xProps, key:Math.random()});
    // xEle.props = {...xEle.props, ...xProps};

    return xEle;
  }
}
