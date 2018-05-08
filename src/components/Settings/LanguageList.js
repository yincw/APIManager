import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin, Switch } from 'antd';

import CommonPage from '../CommonPage';

import LanguageModal from './LanguageModal';
import _ from 'lodash';

class LanguageList extends CommonPage {
  constructor(props) {
    super(props);
    var _this = this;

    this.columns = [
      { title: '名称', dataIndex: 'name', key: 'name' ,width:'40%'},
      { title: '排序', dataIndex: 'sort', key: 'sort' ,width:'20%'},
      { title: '操作', dataIndex: ' ', key: ' ' ,width:'40%', render:(text, record, index) => {
        return (
          <span>
            <span
              onClick={this.handleShowUpdate.bind(this, record)}
              style={{ cursor:'pointer'}}>
              编辑
            </span>
            <span
              onClick={this.handleRemove.bind(this, record)}
              style={{ cursor:'pointer', marginLeft:5}}>
              删除
            </span>
          </span>)
      }},
    ];

    this.modal = LanguageModal;
    this.namespace='language'
  }

  getRRenderComponentData = () => {
    var modelList = this.props[this.namespace] || {};
    return {
      elements: [
        {
          type: 'button',
          data:{children:'添加'},
          //将button的事件映射到RRenderComponent上
          events:{
            onClick:'onShowCreate'
          },
          sort:1,
          position:1
        },{
          type: 'table',
          data:{
            columns:this.columns,
            // onRowDoubleClick:this.handleShowUpdate,
            rowKey: (record) => record.id,
            dataSource:_.sortBy(modelList.list, 'sort'),
            pagination:false,
            bordered: true,
            scroll:{ y: 546 }
        },
          sort:1,
          position:2
        }
      ],
    }
  }

}


function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(LanguageList);
