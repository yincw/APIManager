import { default as BaseService } from './baseService';
import { DocumentGroup, db, Document } from '../../server/models'
import path from 'path';
import fs from 'fs';

class DocumentGroupService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = DocumentGroup;
  }

  removeById = async (id) => {
    var documents = await Document.findAll({where:{group_id:id}});
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
    
    await db.query(`
      with recursive cnt(id, document_id) as (
        SELECT api.id, api.document_id FROM api 
        LEFT JOIN document ON api.document_id = document.id 
        LEFT JOIN document_group on document_group.id = document.group_id
        WHERE document_group.id = '${id}'
      )
      DELETE FROM tag_union_api WHERE EXISTS (
        SELECT * FROM cnt WHERE cnt.id = tag_union_api.api_id
      );`);
    await db.query(`DELETE FROM tag_union_document WHERE EXISTS (
        SELECT * FROM document WHERE tag_union_document.document_id = document.id and document.group_id = '${id}'
      );`);
    await db.query(`DELETE FROM api WHERE EXISTS (
        SELECT * FROM document WHERE api.document_id = document.id and document.group_id = '${id}'
      );`);
    await db.query(`DELETE FROM document WHERE group_id = '${id}';`);
    return db.query(`DELETE FROM document_group WHERE id = '${id}';`);
  }

  //如果不存在is_show=true的列 则添加的时候将is_show设置未true
  create = async (model) => {
    var p = await this.Model.findOne({where:{is_show:true}, raw:true});
    if(!p || !p.id) {
      model.is_show = 1;
    }

    return this.Model.create(model);
  }

  toggleShow = async (id) => {
    var sql = `
      UPDATE document_group SET is_show= 
        CASE 
          WHEN id='${id}' THEN 1
          ELSE 0 
        END;
    `

    return db.query(sql);
  }
}

export default new DocumentGroupService();
