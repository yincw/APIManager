import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).tag;

export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'tag',
  state: {},
  effects: {
    *reqGetTagsOfApi(action, {call, put}) {
      var payload = action.payload || {};
      if(!payload.id) {
        return Promise.reject(new Error('api编号不能为空'));
      }
      var res = yield srv.getByApiId(payload.id);
      yield put({
        type:'api/getSelectedApi',
        payload:{
          selectedApi:payload
        }
      })
      yield put({
        type:'retrieve',
        payload: {
          tagsOfApi: res
        }
      });
    },
    *reqGetDocumentsOfTag(action, {call, put}) {
      var payload = action.payload || {};
      if(!payload.id) {
        return Promise.reject(new Error('tag编号不能为空'));
      }
      var res = yield srv.getDocumentsOfTag(payload.id);

      yield put({
        type:'retrieve',
        payload: {
          documentsOfTag: res
        }
      });
    },
    *reqGetTagsOfDocument(action, {call, put}) {
      var payload = action.payload || {};
      if(!payload.id) {
        return Promise.reject(new Error('document编号不能为空'));
      }
      var res = yield srv.getByDocumentId(payload.id);

      yield put({
        type:'retrieve',
        payload:{
          tagsOfDocument: res
        }
      });
    },
    *reqUnionTagWithDocuments(action, {call, put}) {
      var payload = action.payload || {};
      if(!payload.tag || !payload.tag.id) {
        return Promise.reject(new Error('tag编号不能为空'));
      }
      var res = yield srv.unionTagWithDocuments(payload.tag.id, payload.documents);

      yield put({
        type:'retrieve',
        payload:{
          documentsOfTag: []
        }
      });
    },
  },
  reducers: {
  },
});