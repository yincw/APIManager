import React from 'react';
import {default as  BaseResolver} from './base';
import { Form, Modal, Row, Col } from 'antd';
import NormalModal from '../templates/NormalModal';
const FormItem = Form.Item;

/*
  data
    Modal的props字段
  events
    提供onCancel事件 关闭modal
    提供onCreateOrUpdate事件 更新或者保存数据
  dataTempdate
    动态渲染form表单的子元素
*/
export default  class ModalResolver extends BaseResolver   {
  constructor(dataSource, template, key) {
    super(dataSource, template, key);
  }

  resolve = (each, _this) => {
    each.data = each.data || {};

    //dataTemplate渲染
    each.dataTemplate = each.dataTemplate || [];

    var xProps = {...each.data };
    xProps.childrenDataSource = each.dataTemplate;

    /*绑定和触发事件*/
    each.events = each.events || {};

    if(each.events.onCancel) {
      var evtName = each.events['onCancel'];
      if(evtName && _this.props[evtName]) {
        xProps['onCancel'] = _this.props[evtName].bind(null, xEle, _this, ...arguments)
      }
    }

    var xEvtName = each.events['onCreateOrUpdate'];
    if(xEvtName && _this.props[xEvtName]) {
      xProps['onCreateOrUpdate'] = _this.props[xEvtName].bind(null)
    }

    var xEle = React.createElement(NormalModal, {...xProps, key:this.key});
    return xEle;
  }
}
