import React from 'react';
import {default as  BaseResolver} from './base';
import _ from 'lodash';
import {
  enumRenderWithSelect,
} from '../../../utils/common';

export default  class DomResolver extends BaseResolver  {
  constructor(dataSource, template, key) {
    super(dataSource, template, key);
  }

  resolve = (each, _this) => {
    each.data = each.data || {};
    var dom = each.domElement || 'span';

    var xProps = {...each.data };
    if(_.keys(each.enumData).length) {
      xProps.children = enumRenderWithSelect(each.enumData);
    }

    each.events = each.events || {};

    for(var key in each.events) {
      var evtName = each.events[key];
      if(evtName && _this.props[evtName]) {
        xProps[key] = _this.props[evtName]
      }
    }

    var xEle = React.createElement(dom, {...xProps, key:this.key});

    return xEle;
  }
}
