import React from 'react';
import PropTypes from 'prop-types';
import dva, { connect } from 'dva';
import { Modal, Button, Checkbox, Row, Col } from 'antd';


class TagUnionDocModal extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps, oldProps) {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onOk && this.props.onOk(this.props.model);
    this.props.dispatch({
      type:'tag/reqUnionTagWithDocuments',
      payload:{
        tag:this.props.model,
        documents:this.props.documentsOfTag.map(each => each.id)
      }
    })
    this.handleClose();
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
  }

  handleSelectedChange = (evt) => {
    var cb = evt.target;
    var documentsOfTag = this.props.documentsOfTag;
    if(cb.checked) {
      documentsOfTag.push(cb.dataref);
    } else {
      documentsOfTag = _.reject(documentsOfTag, each => each.id == cb.value);
    }
    this.props.dispatch({
      type:'tag/retrieve',
      payload: {
        documentsOfTag
      }
    })
  }

  renderGroups = () => {
    return this.props.documentGroups.map(each => {
      return (
        <li key={each.id}>
          <div>{each.name}</div>
          <ul>
            {this.renderDocuments(each.id)}
          </ul>
        </li>
      )
    })
  }

  isChecked = (docId) => {
    return  !!_.find(this.props.documentsOfTag, each => each.id == docId);
  }

  renderDocuments = (groupId) => {
    var xDocs = this.props.documents.filter(each => each.group_id == groupId);
    return xDocs.map((each, index) => {
      return (
        <li key={index}>
          <Checkbox
            onChange={this.handleSelectedChange}
            checked={this.isChecked(each.id)}
            key={each.id}
            dataref={each}
            value={each.id}>
            {each.name}
          </Checkbox>
        </li>
      )
    })
  }

  render() {
    const { model } = this.props;
    return (
      <Modal
        onCancel={this.handleClose}
        title={'关联文档'}
        visible={true}
        footer={null}>
        <ul className="view-tag">
          {this.renderGroups()}
        </ul>
        <Button type="primary" onClick={this.handleSubmit} htmlType="submit">
          保 存
        </Button>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  var doc = state.document || {};
  var tag = state.tag || {};
  var documentGroup = state.documentGroup || {};
  return {
    documents : doc.list || [],
    documentGroups: documentGroup.list || [],
    documentsOfTag: tag.documentsOfTag || []
  };
}

export default connect(mapStateToProps)(TagUnionDocModal);
