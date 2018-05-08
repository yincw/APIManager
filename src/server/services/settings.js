import { default as BaseService } from './baseService';
import { Settings, db } from '../../server/models'

class SettingsService extends BaseService {
  isMocking = () => {
    return false;
  }

  constructor(obj) {
    super();
    this.Model = Settings;
  }

  toggleSort = async ({sortEnable}) => {
    var sql1 = `
      UPDATE settings SET sort_enable = '${sortEnable ? 1 : 0}';
    `;

    var sql2 = `
      INSERT INTO settings values (sort_enable= '${sortEnable ? 1 : 0}');
    `;

    var settings = await this.Model.findAll({where:{}, raw:true});
    if(settings.length) {
      return db.query(sql1);
    } else {
      return await this.Model.create({sort_enable:sortEnable ? 1: 0});
    }
  }
}

export default new SettingsService();
