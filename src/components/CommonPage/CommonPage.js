import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Icon, Select, Input, Button, Table, Modal,
  message, Popconfirm, DatePicker, Spin, Switch } from 'antd';

import DefaultTemplate from '../RRender/templates/default';
import RRender from '../RRender';
import TestModal from './TestModal';
import _ from 'lodash';
import { gender, enabledMark } from '../../utils/systemEnum';

const confirm = Modal.confirm;
const warning = Modal.warning;

class CommonPage extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    var _this = this;
    this.state = {
      modalVisible: false,
      testModalVisible:false,
      selectedModel:{},
      pageConditions:{
        rows:10,
        keyword:''
      }
    }

    this.columns = [
      { title: '手机号', dataIndex: 'tel', key: 'tel' ,width:'10%'},
      { title: '昵称', dataIndex: 'nickName', key: 'nickName' ,width:'15%', },
      { title: '注册时间', dataIndex: 'createDate', key: 'createDate' ,width:'15%'},
      { title: '邮箱', dataIndex: 'mail', key: 'mail' ,width:'15%'},
      { title: 'steamID', dataIndex: 'steamId', key: 'steamId' ,width:'15%'},
      { title: '账号状态', dataIndex: 'isDisable', key: 'isDisable' ,width:'7%', render:(text, record, index) => {
        return (
          <Switch
            onDoubleClick={this.handleStopPropagation}
            onChange={this.handleToggleEnable.bind(this, record)}
            checkedChildren="是"
            unCheckedChildren="否"
            checked={!text} />
        )
      }},
      { title: '出售权限', dataIndex: 'permissionsType', key: 'permissionsType' ,width:'13%'},
      { title: '操作', dataIndex: ' ', key: ' ' ,width:'10%', render:(text, record, index) => {
        return (
          <span>
            <Popconfirm title="删除不可恢复，你确定要删除吗?"
              onConfirm={this.handleRemove.bind(this, record)}>
               <Icon type="delete"  title='删除'/>
            </Popconfirm>
            <span
              onClick={this.handleShowDetail.bind(this, record)}
              style={{ cursor:'pointer'}}>
              查看
            </span>
          </span>)
      }},
    ];
  }

  handleStopPropagation = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  }

  handleToggleEnable = (record) => {
    var pageConditions = this.state.pageConditions;
    this.props.dispatch({type:`${this.namespace}/reqToggleEnable`, payload:record, pageConditions})
  }

  getRRenderComponentData = () => {
    var modelList = this.props[this.namespace] || {};
    return {
      elements: [
        {
          type:'existedModal',
          data:{onOk:(model, values) => {console.log('onOk', model, values)}, onClose:()=>{this.setState({testModalVisible:false})}},
          modal: TestModal,
          visible:this.state.testModalVisible,
        },
        {
          type: 'dom',
          domElement:'span',
          data:{
            className:'xxxxx',
            children:'span',
          },
          //将button的事件映射到RRenderComponent上
          events:{
          },
          sort:1,
          position:0
        },
        {
          type: 'dateRange',
          searchField:{
          },
          data:{
            className:'abcdedf',
            startField:'startTime',//搜索字段映射
            endField:'endTime',
            onChange:(val, field) => {
              var pageConditions = this.state.pageConditions;
              pageConditions[field] = val;
              this.setState({
                pageConditions
              }, () => {
                this.handleSearch()
              })
            }
          },
          //将button的事件映射到RRenderComponent上
          events:{
          },
          sort:-1,
          position:0
        },
        {
          type: 'input',
          data:{
            style:{width:150},
            value:this.state.pageConditions.keyword,
            onChange: (evt) => {
              var pageConditions = this.state.pageConditions;
              pageConditions.keyword = evt.target.value;
              this.setState({pageConditions});
            }
          },
          //将button的事件映射到RRenderComponent上
          events:{
          },
          sort:1,
          position:0
        },{
          type: 'button',
          data:{children:'search'},
          //将button的事件映射到RRenderComponent上
          events:{
            onClick:'onSearchByKeyword'
          },
          sort:1,
          position:0
        },{
          type: 'select',
          data:{style:{width:200}, mode:'multiple'},
          arrayData:[], //表示select的数据源key和value相同 enumData的备用方案
          enumData:gender, //标准的键值对 如果enumData存在 则忽略arrayData
          searchField:'gender',
          //将元素的事件映射到RRenderComponent上
          events:{
            onChange:'onSelectChange',
          },
          sort:1,
          position:0
        },{
          type: 'select',
          data:{style:{width:100}},
          arrayData:[], //表示select的数据源key和value相同 enumData的备用方案
          enumData:enabledMark, //标准的键值对 如果enumData存在 则忽略arrayData
          searchField:'isEnabled',
          //将元素的事件映射到RRenderComponent上
          events:{
            onChange:'onSelectChange',
          },
          sort:1,
          position:0
        },{
          type: 'button',
          data:{children:'create'},
          //将button的事件映射到RRenderComponent上
          events:{
            onClick:'onShowCreate'
          },
          sort:1,
          position:1
        },{
          type: 'button',
          data:{children:'showTestModal', onClick:() => {this.setState({testModalVisible:true})}},
          sort:1,
          position:1
        },{
          type: 'table',
          data:{
            columns:this.columns,
            // onRowDoubleClick:this.handleShowUpdate,
            rowKey: (record) => record.id,
            dataSource:modelList.list,
            pagination:{
              showSizeChanger:true,
              onShowSizeChange:this.handlePageSizeChange,
              total:modelList.total,
              current:modelList.current,
              pageSize:this.state.pageConditions.rows,
              onChange: (current) => {
                this.handleSearch({page:current})
              },
            }
          },
          sort:1,
          position:2
        }
      ],
    }
  }

  handlePageSizeChange = (page, size) => {
    var pageConditions = this.state.pageConditions;
    pageConditions.rows = size;
    this.setState({pageConditions}, () => {
      this.handleSearch();
    })
  }

  componentWillMount() {
    this.handleSearch();
  }

  componentWillReceiveProps(nextProps, oldProps) {
    var nModalLoading = nextProps.loading.effects[`${this.namespace}/reqUpdate`];
    var oModalLoading = this.props.loading.effects[`${this.namespace}/reqUpdate`];
    if(nModalLoading != oModalLoading && !nModalLoading) {
      this.setState({
        modalVisible:false
      })
    }
  }

  //事件绑定的元素, rrender, 默认的事件参数
  handleShowCreate = (evt) => {
    this.setState({
      modalVisible:true,
      selectedModel:{}
    })
  }

  handleShowUpdate = (record) => {
    this.setState({
      modalVisible:true,
      selectedModel:record
    })
  }

  handleRemove = (record) => {
    var modelList = this.props[this.namespace] || {};
    var pageConditions = this.state.pageConditions;
    pageConditions.page = modelList.current;
    var _this = this;

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

  handleShowDetail = (record) => {
    this.setState({
      modalVisible:true,
      selectedModel: record,
    }, () => {
      this.props.dispatch({type:`${this.namespace}/reqGetDetail`, payload:record})
    })
  }

  handleCreateOrUpdate = (model, values) => {
    var modelList = this.props[this.namespace] || {};
    var pageConditions = this.state.pageConditions;
    pageConditions.page = modelList.current;

    var payload = {
      ...model,
      ...values
    };

    if(model.id) {
      this.props.dispatch({type:`${this.namespace}/reqUpdate`, payload, pageConditions});
    } else {
      this.props.dispatch({type:`${this.namespace}/reqCreate`, payload, pageConditions});
    }

  }

  handldeSelectChange = (enumObj, searchField, val) => {
    if(_.isArray(val)) {
      val = val.join(',');
    }

    var pageConditions = this.state.pageConditions || {};
    if(!searchField || !enumObj) {
      return;
    }

    this.state.pageConditions[searchField] = val;

    this.setState(pageConditions, () => {
      this.handleSearch();
    })
  }

  handleSearchByKeyword = () => {
    this.handleSearch();
  }

  handleSearch = (conditions) => {
    var payload = {
      ...this.state.pageConditions,
      ...conditions,
    }

    this.props.dispatch({type:`${this.namespace}/reqRetrieve`, payload})
  }

  render() {
    return (
     <div className={this.namespace+'-container'}>
        <RRender
          modalVisible={this.state.modalVisible}
          onCreateOrUpdate={this.handleCreateOrUpdate}
          onShowCreate={this.handleShowCreate}
          onRemove={this.handleRemove}
          onShowUpdate={this.handleShowCreate}
          onSelectChange={this.handldeSelectChange}
          onSearchByKeyword={this.handleSearchByKeyword}
          dataSource={this.getRRenderComponentData()}
          template={DefaultTemplate}>
        </RRender>
        {
          this.state.modalVisible && this.modal &&
          React.createElement(this.modal, {
            onOk:this.handleCreateOrUpdate,
            onClose: ()=>{this.setState({modalVisible:false})},
            model: this.state.selectedModel,
            visible:this.state.modalVisible
          })
        }
     </div>
    );
  }
}

export default CommonPage;
