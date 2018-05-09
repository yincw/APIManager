import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { message, Spin, Icon} from 'antd';

class SpinCtrl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  render() {
    var effects = this.props.effects.map(each => this.props.loading[each]);
    var isLoading = _.every(effects);

    return (
      <div className="view-tree-container">
        {
          isLoading
          ?
          (<div style={{ width: '100%', textAlign: 'center' }}>
            <Spin style={{ textAlign: 'center', width: '100%', marginTop: 50, color:'white' }}
              indicator={<Icon type="loading" style={{ fontSize: 40 }} />}>
            </Spin>
          </div>)
          :
          this.props.children
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  var loading = state.loading || {};
  return {
    loading:loading.effects || {}
  }
}

export default connect(mapStateToProps)(SpinCtrl);
