import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { getName, sortApis } from '../../utils/common';
import { Modal, Select, Input, Form,
  Upload, Button, Tree, Checkbox, List,
  Table, Radio, message, Tooltip } from 'antd';
import Muuri from 'muuri';
// import './less/DocumentIndex.less';
import IndexContent from './IndexContent';
import XLink from '../App/XLink';
import { Scrollbars } from 'react-custom-scrollbars';

class DocumentIndex extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.documents !== this.props.documents) {
      var p = this.getCurrentDocument();
      if(!p || !p.id) {
        this.props.history.push('/')
      }
    }
  }

  getParent = (api) => {
    if(api.parent_id == '0') {
      return _.find(this.props.documents, each => each.id == api.document_id);
    }

    return _.find(this.props.apis, each => each.id == api.parent_id);
  }

  renderTitle = (xDoc) => {
    if(xDoc) {
      return xDoc.name
    } else {
      return '';
    }
  }

  getCurrentDocument = () => {
    var xParams = this.props.match.params;
    if(!xParams.id) return;
    var xDoc = this.props.documents.find(each => each.id == xParams.id);

    return xDoc || {};
  }


  formatData = (xDoc, apis) => {
    var xApis = apis.filter(each => each.document_id == xDoc.id);

    var lv1Apis = xApis.filter(each => each.parent_id == 0 && each.type == 'api');


    var ret = [];
    //找到文档下直接挂载的api
    if(lv1Apis && lv1Apis.length) {
      ret.push({
        id:xDoc.id,
        name:xDoc.name,
        sort:xDoc.sort,
        children:lv1Apis
      });
    }

    var xGroup = xApis.filter(each => each.type == 'group');

    xGroup.forEach(each => {
      var p = xApis
        .filter(item => item.parent_id == each.id && item.type == 'api')

      if(p && p.length) {
        ret.push({
          id:each.id,
          name:this.formatGroupName(each),
          sort:each.sort,
          children:p
        })
      }
    })

    return ret;
  }

  handleApiClick = (api) => {
    this.props.dispatch({type:'tag/reqGetTagsOfApi', payload: api});
    this.props.history.push('/?mid=' + Math.random());
  }

  formatGroupName = (api) => {
    if(api.parent_id == 0) return api.name;
    var parentNode = this.getParent(api) || {};

    return `${parentNode.name} / ${api.name}`;
  }

  getTotal = (item) => {
    let total = 0;
    item.map( ite => {
      total += ite.children.length;
    });
    return total;
  }

  render() {
    var xDoc = this.getCurrentDocument();
    var xApis = sortApis(this.props.apis);

    if(!xDoc.is_group_show) {
      return <XLink />
    }
    return (
      <div className="view-dictionary">
        <h2>{this.renderTitle(xDoc)}（{ this.getTotal( this.formatData(xDoc, xApis) ) }）</h2>
        <div className="view-dictionary-container">
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}>
          {!this.props.loading.models.api &&
            <IndexContent
            documents={this.props.documents}
            apis={this.props.apis}
            xapis={this.formatData(xDoc, xApis)}
            onApiClick={this.handleApiClick} />
          }
        </Scrollbars>
        </div>
      </div>
    );
  }

  componentDidMount() {
  }
}

function mapStateToProps(state) {
  var api = state.api || {};
  var doc = state.document || {};
  var loading = state.loading || {};
  var effects = loading.effects || {};
  return {
    documents: _.sortBy((doc.list || []), 'sort'),
    apis:_.sortBy((api.list || []), 'sort'),
    loading,
    xloading: effects['api/reqGetSelectedApi']
  }
}

export default connect(mapStateToProps)(DocumentIndex);
