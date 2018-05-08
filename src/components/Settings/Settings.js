import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { message, Col, Row, Menu} from 'antd';

import DocumentGroupList from './DocumentGroupList';
import TagList from './TagList';
import LanguageList from './LanguageList';
import DocumentList from './DocumentList';
// import './less/settings.less';

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tagModalVisible:false,
      languageModalVisible:false,
      documentGroupModalVisible:false,
      menuKey:'0',
    }
  }

  componentWillMount() {
    this.props.dispatch({type:'settings/reqRetrieve'})
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleMenuSelected = (item, key, selectedKeys ) => {
    this.setState({
      menuKey:item.key
    })
  }

  render() {
    return (
      <div className="view-setting">
        <div className="view-setting-menu">
          <Menu
            defaultSelectedKeys={['0']}
            onSelect={this.handleMenuSelected}>
            <Menu.Item key="0">文档分组管理</Menu.Item>
            <Menu.Item key="1">语言管理</Menu.Item>
            <Menu.Item key="2">标签管理</Menu.Item>
            <Menu.Item key="3">显示与导出</Menu.Item>
          </Menu>
        </div>
        <div className="view-setting-container">
          {this.state.menuKey == '0' &&
            <DocumentGroupList />
          }

          {this.state.menuKey == '1' &&
            <LanguageList />
          }

          {this.state.menuKey == '2' &&
            <TagList />
          }
          {this.state.menuKey == '3' &&
            <DocumentList />
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  var tag = state.tag || {};
  var api = state.api || {};
  var doc = state.document || {};

  return {
    tagsOfApi: tag.tagsOfApi || [],
    model: api.selectedApi || {},
    documents: _.sortBy((doc.list || []), 'sort'),
    apis:_.sortBy((api.list || []), 'sort')
  }
}

export default connect(mapStateToProps)(Settings);
