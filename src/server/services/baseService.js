import _ from 'lodash';

import Sequelize from 'sequelize';

export default class BaseService {
  constructor() {
  }

  isMocking = () => {
    return false;
  }

  retrieve = (conditions) => {
    conditions = conditions || {};
    return this.Model.findAll({where:conditions, raw:true});
  } 

  create = (model) => {
    return this.Model.create(model);
  }

  remove = (conditions) => {
    return this.Model.destroy({where:conditions});
  } 

  getDetail = (id) => {
    return this.Model.findOne({where:{id:id}, raw:true});
  } 

  multiRemove = (ids) => {
    if(_.isString(ids)) {
      ids = ids.split(',');
    }

    return this.Model.destroy({where:{id:Sequelize.in(ids)}});
  } 

  removeById = (id) => {
    return this.Model.destroy({where:{id}});
  } 

  update = (id, model) => {
    return this.Model.update(model, {where:{id}});
  }

  toggleEnable = (model) => {
    var id = model.id;
    var isShow = model.isShow;
    return this.Model.update({isShow}, {where:{id}});
  }
}