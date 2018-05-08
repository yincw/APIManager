import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).settings;

export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'settings',
  state: {},
  effects: {
    *reqToggleSort(action, {call, put}) {
      var payload = action.payload || {};

      var res = yield srv.toggleSort(payload);
      var msg = payload.sortEnable ? '启用排序成功' : '禁用排序成功';
      message.info(msg);
      yield put({
        type:'reqRetrieve'
      });
    },

  },
  reducers: {
  },
});
