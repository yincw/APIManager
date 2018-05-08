import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal, Radio,
  message, Popconfirm, DatePicker, Spin, Switch } from 'antd';

import CommonPage from '../CommonPage';

import DocumentGroupModal from './DocumentGroupModal';
import _ from 'lodash';
const confirm = Modal.confirm;

class DocumentGroupList extends CommonPage {
  handleItemSelected = (record, evt) => {
    if(record.is_show) {
      return;
    }
    var pageConditions = this.state.pageConditions;
    this.props.dispatch({
      type:`${this.namespace}/reqToggleShow`,
      payload:record,
      pageConditions
    })
  }

  handleRemove = (record) => {
    var modelList = this.props[this.namespace] || {};
    var pageConditions = this.state.pageConditions;
    pageConditions.page = modelList.current;
    var _this = this;
    if(record.is_show) {
      return message.warning('已选中的文档分组不能删除');
    }

    confirm({
      title: '删除后不能恢复！是否确定删除?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        _this.props.dispatch({type:`${_this.namespace}/reqRemove`,
          payload:record, pageConditions})
      },
      onCancel() {
      },
    });
  }

  constructor(props) {
    super(props);
    var _this = this;

    this.columns = [
      { title: ' ', dataIndex: 'is_show', key: 'is_show', width: 40, render:(text, record) => {
        return (<Radio
          onDoubleClick={this.handleStopPropagation}
          checked={text}
          onChange={this.handleItemSelected.bind(this, record)}/>)
      }},
      { title: '名称', dataIndex: 'name', key: 'name' ,width:'40%'},
      { title: '排序', dataIndex: 'sort', key: 'sort' ,width:'20%'},
      { title: '操作', dataIndex: ' ', key: ' ' ,render:(text, record, index) => {
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
    this.modal = DocumentGroupModal;

    this.namespace='documentGroup'
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

export default connect(mapStateToProps)(DocumentGroupList);
