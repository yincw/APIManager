import { default as BaseService } from './baseService';
import { Api, db, Tag, Document, TagUnionApi } from '../../server/models'
import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';

class ApiService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = Api;
  }

  getChildren(apiId) {
    var sql = `with recursive cnt(id, document_id, parent_id, name) as (
        select id, document_id, parent_id, name from api where id ='${apiId}'
        union 
        SELECT a.id, a.document_id, a.parent_id, a.name from api a, cnt b WHERE b.id = a.parent_id
      )

      select * from cnt;`
    return db.query(sql);
  }

  searchByName(name) {
    var sql = `SELECT api.*, document.name as document_name FROM api 
          LEFT JOIN document on api.document_id = document.id 
          WHERE api.name like '%${name}%'
          AND 
          api.type='api'
          AND
          document.isShow = 1`;
    return db.query(sql);
  }

  searchByTag(conditions) {
    var sql = `SELECT api.* from api 
      INNER JOIN tag_union_api tua on api.id = tua.api_id
      WHERE 
      document_id='${conditions.document_id}'  
        AND
      api.type='api'
        AND
      tag_id= '${conditions.tag_id}'`;
      
    return db.query(sql).then(ret => {
      if(!ret || !ret.length == 2) {
        throw new Error('latitude search error');
      }

      var apis = ret[0];
      return Promise.map(apis, this.getParents.bind(this))
    });
  }

  latitudeSearch(conditions) {
    conditions.status = conditions.status || -1;
    conditions.version_status = conditions.version_status || -1;
    var sql = `SELECT * FROM api WHERE 
        type='api'
        AND
        document_id='${conditions.document_id}'  
        AND 
        (${conditions.status}=-1 OR status=${conditions.status})
        AND
        (${conditions.version_status}=-1 OR version_status=${conditions.version_status})
        `;
    return db.query(sql).then(ret => {
      if(!ret || !ret.length == 2) {
        throw new Error('latitude search error');
      }

      var apis = ret[0];
      return Promise.map(apis, this.getParents.bind(this))
    });
  }

  getParents(api) {
    var sql = `with recursive cnt(id, document_id, parent_id, name) as (
        SELECT id, document_id, parent_id, name FROM api WHERE id ='${api.id}'
        UNION 
        SELECT a.id, a.document_id, a.parent_id, a.name FROM api a, cnt b WHERE b.parent_id = a.id
      )

      SELECT * FROM cnt 
      UNION
      SELECT document.id, '' as document_id, '' as parent_id, document.name FROM document 
        WHERE id = '${api.document_id}';`
    
    return db.query(sql).then(ret => {
      if(ret && ret.length == 2) {
        api.ancestors = ret[0];
      }
      return api;
    });
  }
  /*
    1.删除所有子api
    2.删除所有tag_union_api的关系
  */
  removeById = async (id) => {
    var sql1 = `
       with recursive cnt(id, document_id, parent_id, name) as (
        select id, document_id, parent_id, name from api where id ='${id}'
        union 
        SELECT a.id, a.document_id, a.parent_id, a.name from api a, cnt b WHERE b.id = a.parent_id
      )
      delete from tag_union_api WHERE EXISTS(SELECT * from cnt where id = tag_union_api.api_id );
    `

    var sql2 =`
      with recursive cntx(id, document_id, parent_id, name) as (
        select id, document_id, parent_id, name from api where id ='${id}'
        union 
        SELECT a.id, a.document_id, a.parent_id, a.name from api a, cntx b WHERE b.id = a.parent_id
      )
      delete from api WHERE EXISTS(SELECT * from cntx where id = api.id );
    `

    await db.query(sql1);
    return db.query(sql2);
  }

  multiRemove = async (ids) => {
    ids = (ids || []).map(each => "'" + each + "'").join(',');
    var sql1 = `
      with recursive cnt(id, document_id, parent_id, name) as (
        select id, document_id, parent_id, name from api where id in (${ids})
        union 
        SELECT a.id, a.document_id, a.parent_id, a.name from api a, cnt b WHERE b.id = a.parent_id
      )
      delete from tag_union_api WHERE api_id in (select id from cnt);
    `

    var sql2 = `
      with recursive cntx(id, document_id, parent_id, name) as (
        select id, document_id, parent_id, name from api where id in (${ids})
        union 
        SELECT a.id, a.document_id, a.parent_id, a.name from api a, cntx b WHERE b.id = a.parent_id
      )
      delete from api WHERE id in (select id from cntx);
    `

    await db.query(sql1);
    return db.query(sql2)
  }

  create = async (api) => {
    var tapi = await Api.findOne({
      where:{
        name:api.name, 
        parent_id:api.parent_id, 
        document_id:api.document_id,
        type: api.type
      }
    });
    if(tapi) {
      return Promise.reject('文档已经存在');
    }

    if(api.compatibility && _.isObject(api.compatibility))
      api.compatibility = JSON.stringify(api.compatibility);

    var xApi = await Api.create(api);
    if(!xApi) {
      return Promise.reject('创建api失败');
    }

    var tags = api.tags || [];
    var tagUnionApis = tags.map(each => {
      return {
        tag_id:each,
        api_id:xApi.id
      }
    });

    if(tagUnionApis.length)
      await TagUnionApi.bulkCreate(tagUnionApis);

    return xApi;
  }

  retrieve = async (conditions) => {

    var sql = `
      SELECT api.*, document.name as documentName FROM api
        LEFT JOIN document ON api.document_id = document.id WHERE EXISTS (
        SELECT * FROM document_group WHERE document_group.is_show = 1 AND document.group_id = document_group.id
      )
    `;

    return db.query(sql).then(ret => {
      if(ret && ret.length == 2) {
        return ret[0];
      }
      return [];
    });
  }

  changeSort = async (current, dest) => {
    if(!current.id || !dest.id) {
      return Promise.reject('文档不存在');
    }
    [current.sort, dest.sort] = [dest.sort, current.sort];

    await Api.update(current, { where:{id:current.id} });
    return await Api.update(dest, { where:{id:dest.id} });
  }


  update = async (id, api) => {
    var tapi = await Api.findOne({
      where:{
        name:api.name, 
        parent_id:api.parent_id, 
        document_id:api.document_id,
        type: api.type,
        id:{ne:id}
      }
    });
    if(tapi) {
      return Promise.reject('api已经存在');
    }

    api.updated_at = new Date().getTime();
    if(api.compatibility && _.isObject(api.compatibility))
      api.compatibility = JSON.stringify(api.compatibility);

    //删除所有的tagUnionApi
    await TagUnionApi.destroy({where:{api_id:api.id}});
    if(api.tags && api.tags.length) {
      var tagUnionApis = api.tags.map(each => {
        return {
          tag_id:each,
          api_id:api.id
        }
      });
      await TagUnionApi.bulkCreate(tagUnionApis);
    }
    
    return Api.update(api, { where:{id} });
  }
}

export default new ApiService();

