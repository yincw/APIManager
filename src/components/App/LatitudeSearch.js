import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Select, Input, Form, Row, Col,
  Upload, Button, Tree, Checkbox, Icon,
  Table, Radio, message, Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { windowUtil } from '../../utils/windowUtil';
import { getName, hasPermission } from '../../utils/common';
import { apiStatus } from '../../utils/systemEnum';
import dataSource from './dataSource';
import _ from 'lodash';

class LatitudeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[],
      pageConditions:{
        keyword:''
      }
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {

  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  handleApiClick = (api) => {
    this.props.dispatch({type:'tag/reqGetTagsOfApi', payload: api});
    this.props.history.push('/?mid=' + Math.random());
  }

  handleRemove = (api) => {
    const {dispatch} = this.props;

    Modal.confirm({
      title: '删除后不能恢复！是否确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk:() => {
        dispatch({
          type:'api/reqRemoveByIdWhenSearch',
          payload: api
        });
      }
    });
  }

  sortAncestors = (apis) => {
    var dest = [];
    var doc = apis.find(each => each.document_id == '');
    dest.push(doc);
    var firstApi = apis.find(each => each.document_id && each.parent_id == 0);
    dest.push(firstApi);

    while(true) {
      var last = _.last(dest);
      var tApi = apis.find(each => each.parent_id == last.id);
      if(tApi) {
        dest.push(tApi)
      }
      else{
        break
      }

      if(dest.length == apis.length) {
        break;
      }
    }

    dest.pop();

    return dest.map(each => each.name).join('/');
  }

  getColums = () => {
    var columns = [
      {
        title: 'API 名称',
        dataIndex: 'name',
        key: 'name',
        render:(text, record, index) => {
          var parentNode = record.ancestors.find(each => each.id == record.parent_id);
          parentNode =parentNode || record.ancestors[0] || {};
          return (
            <span onClick={this.handleApiClick.bind(this, record)} style={{cursor:'pointer'}}>
            {getName(record, parentNode)}
            </span>
          )
        }
      }, {
        title: 'API 状态',
        dataIndex: 'status',
        key: 'status',
        render:(text, record, index) => {
          return text === 1 ? '' : apiStatus[text+''];
        }
      }, {
        title: '位置',
        dataIndex: 'ancestors',
        key: 'ancestors',
        render:(text, record, index) => {
          return this.sortAncestors(record.ancestors);
        }
      }, {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        render:(text, record, index) => {
          return (
            <span>
              <span
                onClick={this.handleRemove.bind(this, record)}
                style={{ cursor:'pointer', marginLeft:5}}>
                删除
              </span>
            </span>
          )
        }
      }
    ];

    if(!hasPermission()) {
      columns.pop();
    }

    return columns;
  }

  handleMultiRemove = () => {
    if(!this.state.selectedRowKeys || !this.state.selectedRowKeys.length) {
      return Modal.warning({
        title:'请选择需要删除的 API',
        okText: '确认',
      });
    }
    Modal.confirm({
      title: '删除后不能恢复！是否确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk:() => {
        this.props.dispatch({
          type:'api/reqMultiRemove',
          payload: this.state.selectedRowKeys,
          pageConditions:this.props.location.query
        });
      }
    });
  }

  render() {
    console.log(this.props.location.query)
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    var columns = this.getColums();
    var query = this.props.location.state || {};
    return (
      <div className="view-result">

        <h2>{query.key}：{query.value}</h2>

        <Row style={{marginBottom:10}}>
          <Col span={12}>
            <Button onClick={this.handleMultiRemove}>删除</Button>
          </Col>
          <Col span={12}>
            <div className="filter">
              <Input.Search
                value= {this.state.pageConditions.keyword}
                onChange= {(evt) => {
                  var pageConditions = this.state.pageConditions;
                  pageConditions.keyword = evt.target.value;
                  this.setState({pageConditions});
                }}
                placeholder="筛选 API"
              />
            </div>
          </Col>
        </Row>

        <div className="result">
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}>
            <Table
              bordered
              rowSelection={rowSelection}
              rowKey={(record) => record.id}
              dataSource={this.props.latitudeSearchApis
                .filter(each => each.name.indexOf(this.state.pageConditions.keyword) > -1)}
              columns={columns}
              pagination={false} />
          </Scrollbars>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  var api = state.api || {};
  return {
    apis:api.list || [],
    latitudeSearchApis: api.latitudeSearchApis || [],
    tagsOfCurrentApi : api.tagsOfCurrentApi || [],
  }
}

export default connect(mapStateToProps)(LatitudeSearch);
