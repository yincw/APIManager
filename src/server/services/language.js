import { default as BaseService } from './baseService';
import { Language, db } from '../../server/models'

class LanguageService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = Language;
  }

  removeById = async (id) => {
    var sql1 = `
      UPDATE document SET language_id='', language='' WHERE language_id = '${id}';
    `;

    var sql2 = `
      DELETE FROM language where id = '${id}';
    `;

    await db.query(sql1);
    return db.query(sql2);
  }

  multiRemove = async (ids) => {
    ids = (ids || []).map(each => "'" + each + "'").join(',');
    var sql = `
      UPDATE document SET language_id='', language='' WHERE language_id in (${ids});
      DELETE FROM language where id = '${id}';
    `

    return db.query(sql);
  }
}

export default new LanguageService();
