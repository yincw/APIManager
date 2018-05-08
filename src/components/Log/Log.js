import fs from 'fs';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import Markdown from '../Markdown';
import { Scrollbars } from 'react-custom-scrollbars';
import { remote } from 'electron';

class Log extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  getLog =() => {
    var content = '';
    if (process.platform === 'darwin' && process.env.electronMode === 'package') {
      var pathname = path.resolve(process.resourcesPath, '../CHANGELOG.md');
      content = fs.readFileSync(pathname, {encoding:'utf8'});
    } else {
      content = fs.readFileSync('CHANGELOG.md', {encoding:'utf8'});
    }

    remote.app.logger.info('content' + Math.random());

    return content;
  }

  render() {
    return (
      <div className="view-changelog">
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}>
        <Markdown content={this.getLog()} />
      </Scrollbars>
      </div>
    );
  }
}

export default Log
