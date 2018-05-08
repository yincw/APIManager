import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Checkbox, message, Button, Tooltip, Switch } from 'antd';
import {remote} from 'electron';
import configs from '../../configs';
import fse from 'fs-extra';

import _ from 'lodash';

class DocumentList extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleSortChange = (evt) => {
    this.props.dispatch({type:'settings/reqToggleSort', payload:{sortEnable:evt}})
  }

  handleToggleDocument = (evt) => {
    var payload = evt.target.dataRef;
    payload.isShow = !payload.isShow;
    this.props.dispatch({type:'document/reqToggleEnable', payload})
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

  render() {
    var sortEnable = false;
    var settings = this.props.settings;
    if(settings.length) {
      var p = settings[0];
      sortEnable = p.sort_enable;
    }
    return (
      <div className="setting-show">
        <h3>文档显示与导出</h3>
        <ul>
          {
            this.props.documents
            .filter(each => each.is_group_show)
            .map(each => {
              return (
                <li key={Math.random()}>
                  <Checkbox
                    dataRef={each}
                    onChange={this.handleToggleDocument}
                    checked={each.isShow}>
                    {each.name}
                  </Checkbox>
                </li>
              )
            })
          }
        </ul>
        <a className="ant-btn" href="javascript:;" onClick={this.handleExportDocument}>导出</a>

        <h3>排序显示</h3>
        <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.handleSortChange} checked={!!sortEnable} />
      </div>

    );
  }
}

function mapStateToProps(state) {
  var doc = state.document || {};
  var settings = state.settings || {};
  return {
    settings: settings.list || [],
    documents: _.chain(doc.list).sortBy('sort').value(),
  }
}

export default connect(mapStateToProps)(DocumentList);
