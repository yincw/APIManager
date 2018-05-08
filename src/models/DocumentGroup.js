import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).documentGroup;

export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'documentGroup',
  state: {},
  effects: {
    *reqToggleShow(action, {call, put}) {
      var payload= action.payload || {};
      var res = yield srv.toggleShow(payload.id);

      yield put({
        type:'reqRetrieve',
        payload:payload.pageConditions
      });
    },
    *reqRemove(action, {call, put}) {
      var payload = action.payload || {};
      const res = yield srv.removeById(payload.id).catch(err => {
        message.error('删除数据失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } 

      message.info('删除数据成功');

      yield put({
        type: 'removeById',
        payload,
      });

      yield put({
        type: 'api/reqRetrieve',
        payload,
      });

      yield put({
        type: 'document/reqRetrieve',
        payload,
      });

      yield put({
        type: 'tag/reqRetrieve',
        payload,
      });

      yield put({
        type: 'language/reqRetrieve',
        payload,
      });
    },
  },
  reducers: {
  },
});