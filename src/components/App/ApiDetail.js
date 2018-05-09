import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Link } from 'react-router-dom';
import {Select, Input, Checkbox, message } from 'antd';
import { remote, shell } from 'electron';
import { getName, sortApis } from '../../utils/common';
import { apiStatus } from '../../utils/systemEnum';
import Icon from '../Icon';
import Markdown from '../Markdown';
import { Scrollbars } from 'react-custom-scrollbars';

import prev from './images/prev.svg';
import next from './images/next.svg';
// import importt from './images/importt.svg';
// import exportt from './images/exportt.svg';
import _ from 'lodash';
import $ from 'jQuery';

import XLink from './XLink';

class ApiDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }
  componentWillUnmount() {
    $('body').undelegate('.markdown-body a', 'click')
  }

  componentDidMount() {
    $('body').delegate('.markdown-body a', 'click', function(evt) {
      event.preventDefault();
      shell.openExternal(evt.target.href)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { selectedApi, dispatch} = this.props;
    //当api所属文档被删除后 需要刷新当前页面
    if(nextProps.documents !== this.props.documents) {
      if(selectedApi && selectedApi.id) {
        var parentDoc = nextProps.documents.find(each => each.id === selectedApi.document_id );
        if(!parentDoc) {
          dispatch({type:'api/getSelectedApi', payload:{selectedApi:{}}})
        }
      }
    }
  }

  getVersionStatus = (status) => {
    if(!this.props.selectedApi.id) return;
    // if (status === 1) return <a href="javascript:void(0)" onClick={() => { this.handleSearchApis({ version_status: status, name: 'Working Draft' }); }}>Working Draft</a>;
    if (status === 2)
      return (<div className="doc-maturity wd" onClick={() => {
          this.handleSearchApis({version_status: status, name: 'Candidate Recommendation'});
        }}>
          Candidate Recommendation
      </div>);
    if (status === 3)
    return (<div className="doc-maturity cr" onClick={() => {
        this.handleSearchApis({version_status: status, name: 'Recommendation'});
      }}>
        Recommendation
    </div>);
  }

  getStatus = (status) => {
    if(!this.props.selectedApi.id) return;
    status = status || 1;
    var name = apiStatus[status+''];

    if (status === 2) {
      return <sup className="new" onClick={() => { this.handleSearchApis({ status, name }); }}>new</sup>
    }
    if (status === 3) {
      return <sup className="deprecated" onClick={() => { this.handleSearchApis({ status, name }); }}>deprecated</sup>
    }
  }

  handleSearchApis = (tag) => {
    tag.document_id = this.props.selectedApi.document_id;
    this.props.dispatch({type:'api/reqLatitudeSearch', payload:tag});
    this.props.onLatitudeSearch && this.props.onLatitudeSearch();
    var key = _.has(tag, 'status') ? 'API 状态' : '文档成熟度';
    this.props.history.push({
      pathname:'/latitude/search',
      query:tag,
      state:{key, value:tag.name}
    })
  }

  handleTagClick = (tag) => {
    tag.document_id = this.props.selectedApi.document_id;
    this.props.dispatch({type:'api/reqSearchByTag', payload:tag});
    this.props.onLatitudeSearch && this.props.onLatitudeSearch();
    // this.props.history.push('/latitude/search?mid='+Math.random());
    this.props.history.push({
      query:tag,
      pathname:'/latitude/search',
      state:{key:'标签', value:tag.name}
    })
  }

  handleShowPrev = () => {
    var currApi = this.props.selectedApi;

    var xApis = _.filter(this.props.apis, (each) => each.document_id == currApi.document_id);
    var tApis = sortApis(xApis, true);

    var index = _.findIndex(tApis, each => each.id == currApi.id);
    if(index >= 1) {
      index -= 1;
    }

    var prevApi = tApis[index];
    var payload = {
      selectedApi: prevApi
    }

    this.props.dispatch({type:'api/getSelectedApi', payload})
  }

  checkCanPrev = () => {
    var currApi = this.props.selectedApi;

    var xApis = _.filter(this.props.apis, (each) => each.document_id == currApi.document_id);
    var tApis = sortApis(xApis, true);

    var index = _.findIndex(tApis, each => each.id == currApi.id);

    return index < 1;
  }

  checkCanNext= () => {
    var currApi = this.props.selectedApi;

    var xApis = _.filter(this.props.apis, (each) => each.document_id == currApi.document_id);
    var tApis = sortApis(xApis, true);

    var index = _.findIndex(tApis, each => each.id == currApi.id);
    return index > tApis.length - 2;
  }

  handleShowNext = () => {
    var currApi = this.props.selectedApi;

    var xApis = _.filter(this.props.apis, (each) => each.document_id == currApi.document_id);
    var tApis = sortApis(xApis, true);

    var index = _.findIndex(tApis, each => each.id == currApi.id);
    if(index <= tApis.length - 2) {
      index += 1;
    }

    var nextApi = tApis[index];
    var payload = {
      selectedApi: nextApi
    }

    this.props.dispatch({type:'api/getSelectedApi', payload})
  }

  getParent = (api) => {
    if(api.parent_id == '0') {
      return _.find(this.props.documents, each => each.id == api.document_id);
    }

    return _.find(this.props.apis, each => each.id == api.parent_id);
  }

  render() {
    var model = this.props.selectedApi || {};
    var parent = this.getParent(model);
    var compatibility = JSON.parse(model.compatibility || '{}');
    if(model && model.id) {
      return (
        <div className="view-detail">
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}>
            <div className="view-detail-container">
              <h2>
                <span className="name">{getName(model, parent)}</span>
                {this.getStatus(model.status)}
              </h2>

              {/* 文档成熟度 */}
              {this.getVersionStatus(model.version_status)}

              <ul className="tags">
                {
                  this.props.tagsOfApi.map( (each, index) => {
                    return (
                      <li key={index} onClick={this.handleTagClick.bind(this, { tag_id:each.id, name: each.name })}>
                        <a href="javascript:void(0)">{each.name}</a>
                      </li>
                    )
                  })
                }
              </ul>

              {
                model.code &&
                <div className="example">
                  <h3><span>使用示例</span></h3>
                  <Markdown content={model.code || ''} />
                </div>
              }

              {
                model.release_status &&
                <div className="release-mobule-version">
                  <h3><span>发布模块状态</span></h3>
                  <p>{model.release_status}</p>
                </div>
              }

              {
                model.document_version &&
                <div className="release-version">
                  <h3><span>发布文档版本</span></h3>
                  <p>{model.document_version}</p>
                </div>
              }

              {
                compatibility && !_.isEmpty(compatibility) &&
                <div className="compatibility">
                  <h3><span>兼容性</span></h3>
                  <table>
                    <tbody>
                    { Object.keys(compatibility).map(item =>
                      <tr key={item}>
                        <th>{item}</th>
                        <td>{ !compatibility[item].indexOf('latest') ? <span className="latest">{compatibility[item]}</span> : <span className="old">{compatibility[item]}</span> }</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              }

              {
                model.refer_to &&
                <div className="reference">
                  <h3><span>参考文献</span></h3>
                  <Markdown content={model.refer_to || ''} />
                </div>
              }

              <ul className="nav">
                <li>
                  <a disabled={this.checkCanPrev()} href="javascript:void(0)" onClick={this.handleShowPrev}><Icon glyph={prev} /></a>
                </li>
                <li>
                  <a disabled={this.checkCanNext()} href="javascript:void(0)" onClick={this.handleShowNext}><Icon glyph={next} /></a>
                </li>
              </ul>
          </div>
        </Scrollbars>

        </div>
      )
    } else {
      return (
        <XLink />
      )
    }
  }
}

function mapStateToProps(state) {
  var tag = state.tag || {};
  var api = state.api || {};
  var doc = state.document || {};
  return {
    tagsOfApi: tag.tagsOfApi || [],
    selectedApi: api.selectedApi || {},
    documents: _.sortBy((doc.list || []), 'sort'),
    apis:_.sortBy((api.list || []), 'sort')
  }
}

export default connect(mapStateToProps)(ApiDetail);
