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
import MarkdownIt from 'markdown-it';
let md = new MarkdownIt();


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

  getStr = (code, start, end) => {
    let str = "" + md.render(code);
    let text = str.trim().replace(/<[\/\!]*[^<>]*>/ig,"").split('\n');
    return text[0].substring(start, end);
  }

  renderCtrl = () => {
    var xApis = this.props.xapis;
    if(!xApis) return;
    return xApis.map((each, index) => {
      return (
        <li key={index + ''}>
          <h2><span className="name">{each.name}</span> <span className="total">{each.children.length}</span></h2>
          <ul>
          {each.children.map( (item, gindex) => (
            <li key={index + '' + gindex}>
              <a title={getName(item, this.getParent(item))} className={`api-status-${item.status}`} href="javascript:;" onClick={this.props.onApiClick.bind(this, item)}>

                <span className="name">{getName(item, this.getParent(item))}</span>
                <span className="description">{this.getStr(item.code, 20, -19)}</span>

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
