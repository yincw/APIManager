import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).language;

export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'language',
  state: {},
  effects: {
  },
  reducers: {
  },
});