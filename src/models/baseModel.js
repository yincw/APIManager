import { message } from 'antd';
import _ from 'lodash';
import Promise from 'bluebird';

/*
  primaryKey: model的主键id 默认为'id'
  service: 对应的ajax请求服务类
*/
export default class BaseModel {
  constructor(service, primaryKey) {
    this.srv = service;
    this.state = {};
    this.primaryKey = primaryKey || 'id';

    this.subscriptions = {
      setup({history, dispatch}, onError) {
        return history.listen(() => {
        });
      },
    };
   
    this.effects ={};
    this.effects.reqCreate = (function* reqCreate(action, {call, put}) {
      const res = yield this.srv.create(action.payload || {}).catch(err => {
        message.error('添加数据失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } 

      message.info('添加数据成功');
      yield put({
        type: 'reqRetrieve',
        payload: action.pageConditions || {},
      });
    }).bind(this);

    this.effects.reqUpdate = (function* reqUpdate(action, {call, put}) {
      var payload = action.payload || {};
      const res = yield this.srv.update(payload[this.primaryKey], action.payload || {}).catch(err => {
        message.error('更新数据失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } 

      message.info('更新数据成功');
      yield put({
        type: 'update',
        payload
      });
    }).bind(this);

    this.effects.reqToggleEnable = (function* reqToggleEnable(action, {call, put}) {
      var payload = action.payload || {};
      const res = yield this.srv.toggleEnable(payload).catch(err => {
        message.error('启用/禁用设置失败' + (err.message || err));
        return null;
      });

      if(!res) {
        return;
      } 
      message.info('启用/禁用设置成功');

      yield put({
        type: 'update',
        payload
      });
    }).bind(this);

    this.effects.reqGetDetail = (function* reqGetDetail(action, {call, put}) {
        var payload = action.payload || {};
        var primaryKey = this.primaryKey;
        if(!payload || !payload[primaryKey]) {
          return message.error('获取详情失败');
        }
        const res = yield this.srv.getDetail(payload[primaryKey], payload).catch(err => {
          message.error('获取详情失败' + (err.message || err));
          return null;
        });

        if(!res) {
          return;
        } 

        message.info('获取详情成功');

        yield put({
          type: 'getDetail',
          payload: {
            selectedModel: res.data
          },
        });
    }).bind(this);

    this.effects.reqMultiRemove = (function* reqMultiRemove(action, {call, put}) {
        var payload = action.payload || {};
        var primaryKey = this.primaryKey;
        const res = yield this.srv.multiRemove(payload.ids || payload).catch(err => {
          message.error('删除数据失败' + (err.message || err));
          return null;
        });

        if(!res) {
          return;
        } 

        message.info('删除数据成功');

        yield put({
          type: 'reqRetrieve',
          payload: action.pageConditions,
        });
    }).bind(this);

    this.effects.reqRemove =
    this.effects.reqRemoveById = (function* reqRemoveById(action, {call, put}) {
        var payload = action.payload || {};
        var primaryKey = this.primaryKey;
        const res = yield this.srv.removeById(payload[primaryKey]).catch(err => {
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
    }).bind(this);

    this.effects.reqRetrieve = (function* reqRetrieve (action, {call, put}) {
      var res = yield this.srv.retrieve({}).catch(err => {
        message.error('获取数据失败' + (err.message || err));
        return null;
      });
      if(!res) {
        return;
      } 
      res = res.map(each => {return{...each}}) //清理数据库对象带的属性方法
      yield put({
        type: 'retrieve',
        payload: {
          list:res
        },
      });
      
    }).bind(this);

    this.reducers = {
      retrieve(state, {payload}) {
        var p = {...state, ...payload};
        return p;
      },
      getDetail(state, {payload}) {
        var p = {...state, ...payload};
        return p;
      }, 
      update(state, {payload}) {
        var p = {...state };
        var list = p.list || [];
        
        var index =  _.findIndex(list, each => each.id == payload.id);
        list.splice(index, 1, payload);
        // var list = _.reject(list, each => each.id == payload.id);
        // list.push(payload);

        p.list = list;
        return p;
      }, 
      removeById(state, {payload}) {
        var p = {...state };
        var list = [...p.list];
        p.list = _.reject(list, each => each.id == payload.id);
        return p;
      }, 
    };
  }
} 
