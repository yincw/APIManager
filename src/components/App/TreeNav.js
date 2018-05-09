import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Select, Input, Form,
  Upload, Button, Tree, Checkbox,
  Table, Radio, message, Tooltip, Icon as AntIcon } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { getName, hasPermission } from '../../utils/common';
import SpinCtrl from '../SpinCtrl';
import path from 'path';
import _ from 'lodash';
const TreeNode = Tree.TreeNode;
const MENU_TYPE = 'SIMPLE22';
const MENU_TYPE2 = 'SIMPLE222';
import { Scrollbars } from 'react-custom-scrollbars';

import Icon from '../Icon';
import logo from './images/logo.svg';


class TreeNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  isMatch = (name, searchValue) => {
    return name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
  }

  //在搜索状态下 如果分组下面没有apis 则改分组不显示
  hasChildren = (item) => {
    var searchValue = this.state.searchValue;

    if(_.has(item, 'language_id')) return true;
    if(item.type == 'api') return false;
    if(!searchValue) return true;

    var children = [];
    this.getChildren(item, children);

    return children.find(each => each.type == 'api' && this.isMatch(each.name, searchValue));
  }

  documentHasChildren = (item) => {
    var searchValue = this.state.searchValue;
    if(!searchValue) return true;

    return this.props.apis.find(each =>
      each.document_id == item.id &&
      each.type == 'api' &&
      this.isMatch(each.name, searchValue))
  }

  getChildren = (item, ret) => {
    var lv1Children = this.props.apis.filter(each => each.parent_id == item.id);
    if(lv1Children && lv1Children.length) {
      lv1Children.forEach(each => {
        ret.push(each)
        this.getChildren(each, ret);
      })
    }
  }

  highLight = (name) => {
    var searchValue  = this.state.searchValue;
    if(!searchValue) return name;
    const index = name.toLowerCase().indexOf(searchValue.toLowerCase());
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + searchValue.length);
    var hl = name.substr(index, searchValue.length);
    return <span>
      {beforeStr}
      <span style={{ color: '#f50' }}>{hl}</span>
      {afterStr}
    </span>
  }

  getDocuments = () => {
    var documents = this.props.documents;
    return documents.filter(each => each.isShow && each.is_group_show && this.documentHasChildren(each));
  }
  //sortFlag 0:向上 1:向下
  handleChangeSort = (item , parent, sortFlag, evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    var dest = this.getSibling(item, parent, sortFlag);

    var payload = {
      current: {...item},
      dest: {...dest},
    }

    var type = 'document/reqChangeSort';
    if(_.has(item, 'document_id')) {
      type = 'api/reqChangeSort';
    }

    this.props.dispatch({type, payload})
  }

  getSibling  = (item, parent, sortFlag) => {
    var apis = this.props.apis;
    var documents = this.props.documents.filter(each => each.is_group_show);
    //调整文档顺序
    if(!parent || ! parent.id) {
      var currIndex = _.findIndex(documents, item);

      var destIndex = currIndex + sortFlag;
      if(currIndex < 0 || currIndex >= documents.length  || destIndex >= documents.length || destIndex < 0) {
        return null;
      }

      return documents[destIndex];
    }


    //调整文档下第一级api的顺序
    if(_.has(parent, 'language_id')) {
      var xApis = _.filter(apis, each =>
        each.document_id == parent.id &&
        each.type == item.type &&
        each.parent_id == '0');

      var currIndex = _.findIndex(xApis, item);
      var destIndex = currIndex + sortFlag;
      if(currIndex < 0 || currIndex >= xApis.length  || destIndex >= xApis.length || destIndex < 0) {
        return null;
      }

      return xApis[destIndex];
    } else {
      var xApis = _.filter(apis, each =>
        each.parent_id == parent.id &&
        each.type == item.type);

      var currIndex = _.findIndex(xApis, item);
      var destIndex = currIndex + sortFlag;
      if(currIndex < 0 || currIndex >= xApis.length  || destIndex >= xApis.length || destIndex < 0) {
        return null;
      }

      return xApis[destIndex];
    }
  }

  renderTreeNodes = (parent) => {
    var documents = _.sortBy(this.props.documents, 'sort');
    var searchValue = this.state.searchValue;
    //searchValue == '' 时候选取所有的api
    //searchValue !== '' 时候 只选取符合条件的api和其对应的分组

    var apis = this.props.apis.filter(each => {
      return (each.type == 'group' && this.hasChildren(each)) || (each.type == 'api' && this.isMatch(each.name, searchValue));
    });
    var cNodes = [];

    if(!parent) {
      cNodes = documents.filter(each => each.isShow && each.is_group_show && this.documentHasChildren(each));
    } else {
      if(_.has(parent, 'language_id')) {
        cNodes= apis.filter(each => each.parent_id === 0 && each.document_id == parent.id);
      } else {
        cNodes= apis.filter(each => each.parent_id === parent.id);
      }

      cNodes = _.sortBy(cNodes, each => each.type == 'group'? 0 : 1);
    }

    if(!cNodes.length && parent && parent.type == 'api') return null;
    return cNodes.map((item) => {
      return (
        <TreeNode
          className={`type-${item.type || 'doc'}`}
          disableCheckbox ={true}
          isLeaf={item.type == 'api'}
          title={hasPermission() ? this.wrapperWithMenuTrigger(item, parent): this.noWrap(item, parent)}
          parent = {parent}
          key={item.id}
          dataref={item}>
            {this.renderTreeNodes(item)}
        </TreeNode>
      );
    });
  }

  noWrap = (item, parent) => {
    if(parent && item && item.type == 'api') {
      return <div className='well'>
        <span style={{ float:'left'}}>{this.highLight(getName(item, parent))}</span>
        <span style={{ color: '#47494a', float: 'right' }}>{item.version}</span>
      </div>
    }

    return <div className='well'>
      {item.icon && <img style= {{width:18,marginRight:5,float:'left'}}
        src={path.join('assets', item.icon)} />}
      <span style={{ float:'left'}}>{getName(item, parent)}</span>
      <span style={{ color: '#47494a', float: 'right' }}>{item.version}</span>
    </div>
  }

  wrapperWithMenuTrigger = (item, parent) => {
    var menuType = MENU_TYPE;
    var pname = getName(item, parent);
    var name = pname;
    if(parent && item && item.type == 'api') {
      menuType = MENU_TYPE2;
      name = this.highLight(pname);
    }

    return <ContextMenuTrigger
      id={menuType}
      dataref={item}
      parent={parent}
      collect={(props) => (props)}>
      <div className='doc'>
        {item.icon && <img className="doc-icon" src={path.join('assets', item.icon)} />}
        <span className="doc-name" title={pname}>{name}</span>
        <span className="doc-version">{item.version}</span>
        {
          this.props.sortEnable &&
          <span className='sort-container'>
            {
              this.getSibling(item, parent, 1) &&
              <AntIcon type="arrow-down" onClick={this.handleChangeSort.bind(this, item, parent, 1)}/>
            }
            {
              this.getSibling(item, parent, -1) &&
              <AntIcon type="arrow-up" onClick={this.handleChangeSort.bind(this, item, parent, -1)} />
            }
          </span>
        }
      </div>
    </ContextMenuTrigger>
  }

  handleSearchWord = (e) => {
    const value = e.target.value;
    this.setState({
      searchValue: value,
      expandedKeys: this.getDefaultExpandedKeys()
    });
  }

  hasDocuments = () => {
    var documents = this.props.documents.filter(each => each.is_group_show);
    if(!documents || !documents.length) return false;

    return true
  }

  getDefaultExpandedKeys = () => {
    var keys = this.props.documents
      .filter(each => each.isShow && each.is_group_show)
      .map(each => each.id);

    var xGroups = this.props.apis.filter(each => each.type === 'group' && keys.indexOf(each.document_id) > -1);
    return keys.concat((xGroups).map(each => each.id));
  }

  handleExpand = (expandedKeys, opt) => {
    var xId = opt.node.props.dataref.id;
    if(opt.expanded) {
      expandedKeys.push(xId);
    } else {
      expandedKeys = _.reject(expandedKeys, each => each === xId);
    }

    this.setState({
      expandedKeys
    })
  }

  render() {
    var xDocs = this.getDocuments();

    return (
      <div className="view-tree">
        {this.hasDocuments() &&
        <Input.Search
          value={this.state.searchValue}
          placeholder="输入关键字"
          onChange={this.handleSearchWord} />
        }
        <SpinCtrl effects={['document/reqRetrieve', 'api/reqRetrieve']}>
          <Scrollbars autoHide>
          <Tree
            showLine
            autoExpandParent={false}
            selectedKeys = {[this.props.selectedApi.id]}
            expandedKeys={this.state.expandedKeys}
            defaultExpandAll={true}
            onCheck = {this.props.onCheck}
            onExpand={this.handleExpand}
            onSelect={this.props.onSelect}>
            {this.renderTreeNodes()}
          </Tree>
          {!(xDocs && xDocs.length) &&
          <div className="placeholder-empty">
            <Icon glyph={logo} />
            <p>无 API 文档</p>
          </div>
          }
          </Scrollbars>
        </SpinCtrl>

        <ContextMenu id={MENU_TYPE}>
          <MenuItem onClick={this.props.onShowUpdateModal}>编辑</MenuItem>
          <MenuItem onClick={this.props.onRemoveEntity}>删除</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this.props.onShowCreateApiModal}>添加 API</MenuItem>
          <MenuItem onClick={this.props.onShowCreateGroupModal}>添加分组</MenuItem>
        </ContextMenu>
        <ContextMenu id={MENU_TYPE2}>
          <MenuItem onClick={this.props.onShowUpdateModal}>编辑</MenuItem>
          <MenuItem onClick={this.props.onRemoveEntity}>删除</MenuItem>
        </ContextMenu>
    </div>);
  }
}

function mapStateToProps(state) {
  var doc = state.document || {};
  var api = state.api || {};
  var settings = state.settings || {};
  var list = settings.list || [];
  var sortEnable = list.length ? list[0].sort_enable : false;
  return {
    documents: _.sortBy((doc.list || []), 'sort'),
    selectedApi: api.selectedApi || {},
    apis:_.sortBy((api.list || []), 'sort'),
    sortEnable:!!sortEnable
  }
}

export default connect(mapStateToProps)(TreeNav);
