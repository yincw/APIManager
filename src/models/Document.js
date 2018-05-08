import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).document;

export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'document',
  state: {},
  effects: {
    *reqGetDocumentsAndApis(action, {call, put}) {
      var payload = yield srv.getDocumentAndApis();

      yield put({
        type:'getDocumentsAndApis',
        payload
      });
    },

    *reqChangeSort(action, {call, put}) {
      var payload = action.payload || {};
      if(!payload.current || !payload.dest) {
        return;
      }

      var res = yield srv.changeSort(payload.current, payload.dest).catch(err => {
        message.error('调整顺序失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } ;

      yield put({
        type:'reqRetrieve',
      });
    },

    *reqImport(action, {call, put}) {
      var payload = yield srv.importData(action.payload)
        .then(() => {
          message.info('数据导入成功')
          return '';
        }).catch(err => {
          message.error(err.message);
        });
    },

    *reqExport(action, {call, put}) {
      var payload = yield srv.exportData(action.payload)
        .then(() => {
          message.info('数据导出成功');
          return 'ok';
        }).catch(err => {
          message.error(err.message);
        });
    },
  },
  reducers: {
    getDocumentsAndApis(state, {payload}) {
      return {...state, ...payload};
    },
  },
});