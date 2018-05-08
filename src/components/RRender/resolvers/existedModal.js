import React from 'react';
import {default as  BaseResolver} from './base';
import {
  enumRenderWithSelect,
  arrayRenderWithSelect
} from '../../../utils/common';
import _ from 'lodash';

export default  class ExistedModalResolver extends BaseResolver  {
  constructor(dataSource, template, key) {
    super(dataSource, template, key);
  }

  resolve = (each, _this) => {
    each.data = each.data || {};
    var ele = each.modal;

    if(!ele || !each.visible) {
      return null;
    }


    var xProps = {...each.data };
    if(_.keys(each.enumData).length) {
      xProps.children = enumRenderWithSelect(each.enumData);
    }

    each.events = each.events || {};

    for(var key in each.events) {
      var evtName = each.events[key];
      if(evtName && _this.props[evtName]) {
        if(key == 'onChange') {
          xProps[key] = _this.props[evtName].bind(null, each.enumData, each.searchField)
        } else {
          xProps[key] = _this.props[evtName]
        }
      }
    }

    var xEle = React.createElement(ele, {...xProps, key:this.key});

    return xEle;
  }
}
