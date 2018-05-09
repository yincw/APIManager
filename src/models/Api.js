import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';
import modelExtend from 'dva-model-extend';
import { default as BaseModel } from './baseModel';
import { remote } from 'electron';
var srv = (remote.app.dataProxy || {}).api;
var tagSrv = (remote.app.dataProxy || {}).tag;

function foo() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve('ok');
    },10)
  })
}
export default modelExtend(new BaseModel(srv || {}), {
  namespace: 'api',
  state: {},
  effects: { 
    *reqSearchApis(action, {call, put}) {
      var payload = action.payload || {};
      var ret = yield srv.searchByName(payload.name);
      if(ret && ret.length == 2) {
        yield put({
          type:'searchApis',
          payload: {
            searchApis: ret[0]
          }
        });
      }
    },
    *reqMultiRemove(action, {call, put}) {
      var payload = action.payload || {};
      const res = yield srv.multiRemove(payload.ids || payload).catch(err => {
        message.error('删除数据失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } 

      message.info('删除数据成功');

      yield put({
        type: 'reqLatitudeSearch',
        payload: action.pageConditions,
      });

      yield put({
        type: 'reqRetrieve',
        payload: action.pageConditions,
      });
    },
    *reqGetSelectedApi(action, {call, put}) {
      var payload = action.payload || {};
      var ret = yield foo('为了刷新文档索引页面，hack一个异步请求');
      yield put({
        type:'getSelectedApi',
        payload:{
          selectedApi:{}
        }
      })
    },
    *reqRemoveByIdWhenSearch(action, {call, put}) {
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
        type: 'removeByIdWhenSearch',
        payload,
      });

    },
    *reqLatitudeSearch(action, {call, put}) {
      var payload = action.payload || {};
      var ret = yield srv.latitudeSearch(payload);
      yield put({
          type:'latitudeSearch',
          payload: {
            latitudeSearchApis: ret
          }
        });
    },
    *reqSearchByTag(action, {call, put}) {
      var payload = action.payload || {};
      var ret = yield srv.searchByTag(payload);
      yield put({
          type:'latitudeSearch',
          payload: {
            latitudeSearchApis: ret
          }
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
  },
  reducers: {
    searchApis(state, {payload}) {
      return {...state, ...payload};
    },
    getSelectedApi(state, {payload}) {
      return {...state, ...payload};
    },
    removeByIdWhenSearch(state, {payload}) {
      var latitudeSearchApis = state.latitudeSearchApis || [];
      state.latitudeSearchApis = _.reject(latitudeSearchApis, each => each.id == payload.id);
      return {...state};
    },
    latitudeSearch(state, {payload}) {
      return {...state, ...payload};
    },
    retrieve(state, {payload}) {
      var p = {...state, ...payload};
      p.selectedApi = {};
      return p;
    },
    getDetail(state, {payload}) {
      var p = {...state, ...payload};
      p.selectedApi = {};
      return p;
    }, 
    update(state, {payload}) {
      var p = {...state };
      var list = p.list || [];
      
      var index =  _.findIndex(list, each => each.id == payload.id);
      list.splice(index, 1, payload);

      p.list = list;
      p.selectedApi = {};
      return p;
    }, 
    removeById(state, {payload}) {
      var p = {...state };
      var list = [...p.list];
      p.list = _.reject(list, each => each.id == payload.id);
      p.selectedApi = {};
      return p;
    }, 
  },
});