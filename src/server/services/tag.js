import { default as BaseService } from './baseService';
import { Tag, TagUnionDocument, db } from '../../server/models'

class TagService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = Tag;
  }

  removeById = async (id) => {
    var sql1 = `
      DELETE FROM tag_union_api where tag_id = '${id}';
    `

    var sql2 = `
      DELETE FROM tag_union_document where tag_id = '${id}';
    `

    var sql3 = `
      DELETE FROM tag where id = '${id}';
    `
    await db.query(sql1);
    await db.query(sql2);
    return db.query(sql3);
  }

  multiRemove = async (ids) => {
    ids = (ids || []).map(each => "'" + each + "'").join(',');
    var sql = `
      DELETE FROM tag_union_api where tag_id in (${ids});
      DELETE FROM tag_union_document where tag_id in (${ids});
      DELETE FROM tag where id in (${ids});
    `

    return db.query(sql);
  }

  getByApiId = async (apiId) => {
    var sql = `SELECT t.* FROM tag  t 
      JOIN tag_union_api tua on t.id = tua.tag_id 
      WHERE tua.api_id = '${apiId}' 
    `
    return db.query(sql).then(ret => {
      return ret[0]
    });
  }

  getDocumentsOfTag = async (tagId) => {
    var sql = `SELECT d.* FROM document  d 
      JOIN tag_union_document tud on d.id = tud.document_id 
      WHERE tud.tag_id = '${tagId}' 
    `
    return db.query(sql).then(ret => {
      return ret[0]
    });
  }

  unionTagWithDocuments = async (tagId, docs) => {
    docs = docs || [];
    var cleanSql = `DELETE FROM tag_union_document
      WHERE tag_id = '${tagId}' 
    `
    var tuds = docs.map(each => {
      return {
        tag_id: tagId,
        document_id: each,
      }
    })
    await db.query(cleanSql);

    return TagUnionDocument.bulkCreate(tuds, {raw:true});
  }

  getByDocumentId = async (documentId) => {
    var sql = `SELECT t.* FROM tag  t 
      JOIN tag_union_document tud on t.id = tud.tag_id 
      WHERE tud.document_id = '${documentId}' 
    `

    return db.query(sql).then(ret => {
      return ret[0]
    });
  }
}

export default new TagService();
