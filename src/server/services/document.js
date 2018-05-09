import { default as BaseService } from './baseService';
import { Document, Api, db, DocumentGroup } from '../../server/models'
import fs from 'fs';
import { importData as xImportData } from '../utils/importHelper';
import { exportData as xExportData } from '../utils/exportHelper';

var Promise = require('bluebird');
var path = require('path');

import Sequelize from 'sequelize';

class DocumentService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = Document;
  }

  getDocumentAndApis = async () => {
    var documents = await Document.findAll({raw:true});
    var apis = await Api.findAll({raw:true});

    return {documents, apis};
  }

  /*
    删除所有图片
    删除taguniondocument中间表的关系
    删除tagunionapi中间关系
    删除所有api
  */
  removeById = async (id) => {
    var documents = await Document.findAll({where:{id}});
    var icons = documents.map(each => {
      if(each.icon) {
        return path.join(process.cwd(), 'assets', each.icon);
      } else {
        return ''
      }
    });

    icons.forEach(each => {
      if(each && fs.existsSync(each)) {
        fs.unlinkSync(each);
      }
    })

    await db.query(`DELETE FROM tag_union_document WHERE document_id = '${id}';`);
    await db.query(`DELETE FROM tag_union_api WHERE 
        exists (SELECT * FROM api where document_id = '${id}' AND id = tag_union_api.api_id);`);
    await db.query(`DELETE FROM api WHERE document_id = '${id}';`);
    return db.query(`DELETE FROM document where id = '${id}';`);
  }

  multiRemove = async (ids) => {
    var documents = await Document.findAll({where:{id:Sequelize.in(ids)}});
    var icons = documents.map(each => {
      if(each.icon) {
        return path.join(process.cwd(), 'assets', each.icon);
      } else {
        return ''
      }
    });

    icons.forEach(each => {
      if(each && fs.existsSync(each)) {
        fs.unlinkSync(each);
      }
    });

    ids = ids.map(each => "'" + each + "'").join(',');

    var sql = `
      DELETE FROM tag_union_document WHERE document_id in (${ids});
      DELETE tua FROM tag_union_api WHERE 
        exists (SELECT * FROM api where document_id in (${ids}) AND id = tua.api_id);
      DELETE FROM api WHERE document_id in (${ids});
      DELETE FROM document where id in (${ids});
    `;

    return db.query(sql);
  }

  create = async (doc) => {
    if(!doc.name) {
      return Promise.reject('文档名称不能为空');
    }

    if(!doc.language_id || !doc.language) {
      return Promise.reject('文档所属语言不能为空');
    }

    var xdoc = await Document.findOne({where:{name:doc.name}});
    if(xdoc) {
      return Promise.reject('文档不能重名');
    }

    return Document.create(doc);
  }

  //只获取DocumentGroup.is_show=1的文档
  retrievex = async (conditions) => {
    var xGroup = await DocumentGroup.findOne({where:{is_show:1}});
    if(!xGroup || !xGroup.id) {
      return Promise.resolve([]);
    }
    conditions = conditions || {};
    conditions.group_id = xGroup.id;
    return this.Model.findAll({where:conditions, raw:true});
  }

  retrieve = async (conditions) => {
    var sql = `
      SELECT *, (SELECT is_show from document_group where id=group_id) as is_group_show  FROM document
    `;

    return db.query(sql).then(ret => {
      if(ret && ret.length == 2) {
        return ret[0];
      }
      return [];
    });
  }

  update = async (id, doc) => {
    if(!doc.name) {
      return Promise.reject('文档名称不能为空');
    }

    if(!doc.language_id || !doc.language) {
      return Promise.reject('文档所属语言不能为空');
    }

    var xdoc = await Document.findOne({where:{name:doc.name, id:{ne:id}}});
    if(xdoc) {
      return Promise.reject('文档不能重名');
    }

    doc.updated_at = new Date().getTime();

    return Document.update(doc, { where:{id} });
  }

  changeSort = async (current, dest) => {
    if(!current.id || !dest.id) {
      return Promise.reject('文档不存在');
    }
    [current.sort, dest.sort] = [dest.sort, current.sort];

    await Document.update(current, { where:{id:current.id} });
    return await Document.update(dest, { where:{id:dest.id} });
  }

  importData = async (src) => {
    await xImportData(src);
  }

  exportData = async (path) => {
    await xExportData(path);
  }
}

export default new DocumentService();
