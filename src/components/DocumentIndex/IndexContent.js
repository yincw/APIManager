import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { getName } from '../../utils/common';
import { apiStatus } from '../../utils/systemEnum';
import { Modal, Select, Input, Form,
  Upload, Button, Tree, Checkbox, List,
  Table, Radio, message, Tooltip } from 'antd';
import Muuri from 'muuri';
// import './less/DocumentIndex.less';

class IndexContent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  getParent = (api) => {
    if(api.parent_id == '0') {
      return _.find(this.props.documents, each => each.id == api.document_id);
    }

    return _.find(this.props.apis, each => each.id == api.parent_id);
  }

  renderCtrl = () => {
    var xApis = this.props.xapis;
    if(!xApis) return;
    return xApis.map((each, index) => {
      return (
        <li key={index + ''}>
          <h2>{each.name}</h2>
          <ul>
          {each.children.map( (item, gindex) => (
            <li key={index + '' + gindex}>
              <a title={getName(item, this.getParent(item))} className={`api-status-${item.status}`} href="javascript:;" onClick={this.props.onApiClick.bind(this, item)}>

                {getName(item, this.getParent(item))}

                {
                  item.status ===2 &&
                  <span className="status">
                    {apiStatus[item.status+'']}
                  </span>
                }

              </a>
            </li>
          ))}
          </ul>
        </li>
      )
    })
  }

  render() {
    return (
      <ul className="waterfall">
        {this.renderCtrl()}
      </ul>
    );
  }

  componentDidMount() {
    new Muuri('.waterfall');
  }
}


export default IndexContent;
