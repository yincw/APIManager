import React from 'react';
import {default as  BaseResolver} from './base';
import _ from 'lodash';
import DateRange from '../components/DateRange'


export default  class DateRangeResolver extends BaseResolver  {
  constructor(dataSource, template, key) {
    super(dataSource, template, key);
  }

  resolve = (each, _this) => {
    each.data = each.data || {};



    var xProps = {...each.data };
    each.events = each.events || {};

    for(var key in each.events) {
      var evtName = each.events[key];
      if(evtName && _this.props[evtName]) {
        xProps[key] = _this.props[evtName]
      }
    }

    var xEle = React.createElement(DateRange, {...xProps, key:this.key});
    return xEle;
  }
}
