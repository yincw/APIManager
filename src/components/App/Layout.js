import React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import PropTypes from 'prop-types';
import { Modal, Select, Input, Button, Tree, Checkbox, Table, Radio, message, Tooltip } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import path from 'path';

// import add from './images/add.svg';
// import importt from './images/importt.svg';
// import exportt from './images/exportt.svg';
// import display from './images/display.svg';

// import './less/app.less';
// import './less/modal.less';
// import './less/topnav.less';

import SearchInput from '../SearchInput';
import Icon from '../Icon';
import DocumentModal from './DocumentModal';
import GroupModal from './GroupModal';
import ApiPanel from './ApiPanel';
import CommandArea from './CommandArea';
import TopNav from './TopNav';
import TreeNav from './TreeNav';
import ApiDetail from './ApiDetail';
import LatitudeSearch from './LatitudeSearch';
import Panel from '../Panel';

const Option = Select.Option;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const uuidv1 = require('uuid/v1');

var fs = window.require('fs');

class App extends React.Component {
  static defaultProps = {}
  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      documentVisible:false,
      selectedDocument:{},
      groupVisible:false,
      latitudeSearchVisible:false,
      selectedGroup:{},
      apiPanelVisible:false,
      addApi: false,
      selectedApi:{},
      selectedKeys:[],

      checkable:false,
      parentNode:{},
    }
  }

  componentWillMount() {
    this.initCtrl();
  }

  componentWillReceiveProps(nextProps) {
    var loading = nextProps.loading || {};
    var p = loading.effects || {};
    //判断数据是否导入完成
    if(_.has(p, 'document/reqImport') && p['document/reqImport'] === false
        && this.props.loading.effects['document/reqImport']) {
      this.initCtrl();
    }

    if(_.has(p, 'documentGroup/reqToggleShow') && p['documentGroup/reqToggleShow'] === false
        && this.props.loading.effects['documentGroup/reqToggleShow']) {
      this.initCtrl();
    }
  }

  initCtrl = () => {
    this.props.dispatch({type:'document/reqRetrieve', payload:{}});
    this.props.dispatch({type:'api/reqRetrieve', payload:{}});
    this.props.dispatch({type:'documentGroup/reqRetrieve', payload:{}});
    this.props.dispatch({type:'language/reqRetrieve', payload:{}});
    this.props.dispatch({type:'settings/reqRetrieve', payload:{}});
  }

  /**********左下按钮 start**********/
  handleShowDocumentModal = () => {
    this.setState({
      documentVisible:true,
      selectedDocument:{}
    })
  }

  handleToggleDocument = (evt) => {
    var payload = evt.target.dataref;
    payload.isShow = !payload.isShow;
    this.props.dispatch({type:'document/reqToggleEnable', payload})
  }

  handleImportDocument = () => {
    remote.dialog.showOpenDialog({
      properties: ['openFile']
    }, (path) => {
      if(path)
        this.props.dispatch({type:'document/reqImport', payload:path});
    })
  }

  handleExportDocument = () => {
    var xDocs = this.props.documents.filter(each => each.is_group_show && each.isShow);
    if(!xDocs || !xDocs.length) {
      return message.warning('请选择需要导出的文档');
    }

    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (path) => {
      if(path)
        this.props.dispatch({type:'document/reqExport', payload:path});
    })
  }
  /**********左下按钮 end**********/

  hanleCreateOrUpdateDocument = (model, values) => {
    if(values.icon.indexOf('/') > -1 || values.icon.indexOf('\\') > -1) {
      var filename = uuidv1() + path.extname(values.icon);
      values.icon =  filename;

      var readStream = fs.createReadStream(values.icon);
      if(!fs.existsSync(path.join(process.cwd(), 'assets')))
        fs.mkdirSync(path.join(process.cwd(), 'assets'))

      var writeStream = fs.createWriteStream(path.join(process.cwd(), 'assets', filename));
      readStream.pipe(writeStream);
    }

    var payload = {...model, ...values};

    if(payload.id){
      this.props.dispatch({type:'document/reqUpdate', payload})
    } else {
      this.props.dispatch({type:'document/reqCreate', payload})
    }

    this.setState({
      documentVisible:false,
    })
  }

  getParent = (api) => {
    if(!_.has(api, 'document_id')) {
      return {};
    }

    if(api.parent_id == 0) {
      return this.props.documents.find(each => each.id == api.document_id);
    }

    return this.props.apis.find(each => each.id == api.parent_id);
  }

  handleCreateOrUpdateApi = (model, values) => {
    var payload = {...model, ...values};
    var parentNode = this.state.parentNode;
    if(parentNode && parentNode.id) {
      if(_.has(parentNode, 'language_id')) {
        payload.parent_id = 0;
        payload.document_id = parentNode.id
      } else {
        payload.parent_id = parentNode.id;
        payload.document_id = parentNode.document_id;
      }
    }

    if(payload.id){
      this.props.dispatch({type:'api/reqUpdate', payload})
    } else {
      this.props.dispatch({type:'api/reqCreate', payload})
    }

    this.setState({
      parentNode:{},
      groupVisible:false,
      apiPanelVisible:false,
    })
  }

  handleShowUpdateModal = (evt, opt) => {
    var dataref = opt.dataref;
    if(!dataref) return message.error('弹出编辑框错误');
    var parentNode = this.getParent(dataref);
    if(_.has(dataref, 'language_id')) {
      this.setState({
        parentNode:parentNode,
        documentVisible:true,
        selectedDocument:dataref
      })
    } else if(dataref.type == 'api') {
      this.setState({
        parentNode:parentNode,
        apiPanelVisible:true,
        addApi: false,
        selectedApi:dataref
      }, () => {
        this.props.dispatch({type: 'tag/reqGetTagsOfDocument', payload:{id: dataref.document_id} });
        this.props.dispatch({type: 'tag/reqGetTagsOfApi', payload:dataref });
      })
    } else if(dataref.type == 'group') {
      this.setState({
        parentNode:parentNode,
        groupVisible:true,
        selectedGroup:dataref
      })
    }
  }

  handleShowCreateApiModal = (evt, opt) => {
    var dataref = opt.dataref;
    if(!dataref) return message.error('弹出编辑框错误');

    this.setState({
      parentNode:dataref,
      apiPanelVisible:true,
      addApi: true,
      selectedApi:{}
    }, () => {
      this.props.dispatch({
        type: 'tag/reqGetTagsOfDocument',
        payload:{id: dataref.document_id || dataref.id}
      })

      this.props.dispatch({
        type: 'tag/retrieve',
        payload:{tagsOfApi:[]}
      })
    })
  }

  handleShowCreateGroupModal = (evt, opt) => {
    var dataref = opt.dataref;
    if(!dataref) return message.error('弹出编辑框错误');

    this.setState({
      parentNode:dataref,
      groupVisible:true,
      selectedGroup:{}
    })
  }

  handleRemoveEntity = (evt, opt) => {
    const {dispatch} = this.props;
    var payload = opt.dataref;
    var type = _.has(payload, 'language_id') ? 'document/reqRemoveById' : 'api/reqRemoveById';

    Modal.confirm({
      title: '删除后不能恢复！是否确定删除?',
      okText: '确认',
      cancelText: '取消',
      onOk:() => {
        dispatch({type, payload});
      }
    });
  }

  warning() {
    Modal.confirm({
      title: '你确定要删除选中的 API？',
      okText: '确认',
      cancelText: '取消',
    });
  }

  componentDidMount() {
  }

  handleSelectDoc = (key, evt) => {
    var dataref = evt.node.props.dataref;
    if(!evt.selected) {
      this.setState({
        selectedDocument:{},
        selectedApi:{},
        selectedGroup:{},
        selectedKeys:[],
      }, () => {
        this.props.dispatch({type:'api/getSelectedApi', payload: {selectedApi:{}}});
        this.props.history.push(`/?mid=${Math.random()}`);
      });
      return;
    }

    if(!dataref) return;

    if(_.has(dataref, 'language_id')) {
      this.setState({
        selectedDocument:dataref,
        selectedApi:{},
        selectedGroup:{},
        selectedKeys:key,
      }, () => {
        //未了刷新页面 hack一个异步请求
        this.props.dispatch({type:'api/reqGetSelectedApi', payload: {selectedApi:{}}});
        this.props.history.push(`/doc/${dataref.id}?mid=${Math.random()}`);
      });
    } else if(dataref.type == 'api') {
      this.setState({
        selectedDocument:{},
        selectedApi:dataref,
        selectedGroup:{},
        selectedKeys:key,
      }, () => {
        this.props.dispatch({type:'tag/reqGetTagsOfApi', payload: dataref});
        this.props.history.push('/?mid=' + Math.random());
      })
    } else if(dataref.type == 'group') {
      this.setState({
        selectedDocument:{},
        selectedApi:{},
        selectedGroup:dataref,
        selectedKeys:key,
      }, () => {
        this.props.dispatch({type:'api/getSelectedApi', payload: {selectedApi:{}}});
        this.props.history.push('/?mid=' + Math.random());
      })
    }

  }

  handleSearchByName = (value, opt) => {
    var dataref = opt.props.api;
    this.setState({
        selectedDocument:{},
        selectedApi:dataref,
        selectedGroup:{},
      }, () => {
        this.props.dispatch({type:'tag/reqGetTagsOfApi', payload: dataref});
        this.props.history.push('/?mid=' + Math.random());
      })
  }

  handlePressEnter = (e) => {

  }

  renderTree = () => {
    return <TreeNav
      onPressEnter={this.handlePressEnter}
      onRemoveEntity={this.handleRemoveEntity}
      onShowUpdateModal={this.handleShowUpdateModal}
      onShowCreateApiModal={this.handleShowCreateApiModal}
      onShowCreateGroupModal={this.handleShowCreateGroupModal}
      onCheck={this.handleChecked}
      onMenuItemClick={this.handleMenuItemClick}
      onExpand={this.handleExpand}
      onSelect={this.handleSelectDoc} />
  }

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="toc">
            <div className="toc-container">
              <div className="view-wrap">
                  {this.renderTree()}
              </div>
            </div>
          </div>
          <CommandArea
            onImportDocument={this.handleImportDocument}
            onExportDocument={this.handleExportDocument}
            onToggleDocument={this.handleShowToggleDocument}
            onAddDocument={this.handleShowDocumentModal}>
          </CommandArea>
        </div>
        <div className="container">
          {this.props.children}
        </div>

      {this.state.documentVisible &&
        <DocumentModal
          model={this.state.selectedDocument}
          onOk={this.hanleCreateOrUpdateDocument}
          onClose={() => this.setState({documentVisible:false, selectedDocument:{}})}/>
      }

      {this.state.groupVisible &&
        <GroupModal
          model={this.state.selectedGroup}
          onOk={this.handleCreateOrUpdateApi}
          onClose={() => this.setState({groupVisible:false, selectedGroup:{}})}/>
      }
       <Panel
        isOpened={this.state.apiPanelVisible}
        title={ this.state.addApi == true ? '添加 API' : '编辑 API'}
        onClose={() => this.setState({apiPanelVisible:false, selectedApi:{}})}>
          { this.state.apiPanelVisible &&
            <ApiPanel
              model={this.state.selectedApi}
              parentNode={this.state.parentNode}
              onClose={() => this.setState({apiPanelVisible:false, selectedApi:{}})}
              onOk={this.handleCreateOrUpdateApi} />
          }
      </Panel>

    </div>
    )
  }
}

function mapStateToProps(state) {
  var doc = state.document || {};
  var api = state.api || {};
  return {
    loading: state.loading || {},
    documents: _.chain(doc.list).sortBy('sort').value(),
    apis: api.list || [],
  }
}

export default connect(mapStateToProps)(App);
