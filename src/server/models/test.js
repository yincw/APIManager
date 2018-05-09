var db = require('./db');
var Document = require('./document');
var Api = require('./api');
var Tag = require('./tag');
var Language = require('./language');
var moment = require('moment');

var mode = process.argv[2];
var arg = process.argv.splice(3)

var handler = {
  clean() {
    Document.destroy({where:{}}).then((x) => {
      console.log('clean', x)
    }).catch(err => {
      console.log(err.message)
    })
  },

  remove(name) {
    Document.destroy({where:{name}}).then((x) => {
      console.log('remove', x)
    }).catch(err => {
      console.log(err.message)
    })
  },

  create(name) {
    Document.create({name}).then(doc => {
      console.log('create success')
    }).catch(err => {
      console.log(err.message)
    })
  },

  multiCreate() {
    Document.bulkCreate([{name:1},{name:2},{name:3}], {raw:true}).then(doc => {
      console.log('create success', doc)
    }).catch(err => {
      console.log(err.message)
    })
  },


  async updatex(name, newName) {
    var doc = await Document.update({name:newName}, {where:{name:name}});
    if(doc) {
      console.log('update docx', doc)
    } else {
      console.log('update docx failed')
    }
  },

  update: (name, newName) => {
    Document.update({name:newName}, {where:{name:name}}).then(doc => {
      console.log('update docx', doc)
    }).catch(err => {
      console.log(err.message)
    })
   
  },

  retrieve() {
    Document.findAll({raw:true}).then(docs => {
      console.log(docs)
    }).catch(err => {
      console.log(err.message)
    })
  },

  findOne(name) {
    Document.findOne().then(docs => {
      console.log(docs, '...')
    }).catch(err => {
      console.log(err.message)
    })
  },

  createApi(name) {
    Api.create({name}).then(doc => {
      console.log('create success')
    }).catch(err => {
      console.log(err.message)
    })
  },

  multiRemove() {
    db.query('DELETE FROM document; DELETE FROM api;').then(() => {
      console.log('multi remove success');
    }).catch(err => {
      console.log(err.message)
    })
  },

  recursive() {
    db.query(`with recursive
     cnt(x) as (values(1) union all select x+1 from cnt where x < 10000)
     select * from cnt;`).then((docs) => {
      console.log('recursive success', docs);
    }).catch(err => {
      console.log(err.message)
    })
  },

  getChildren(id) {
    var sql = `with recursive cnt(id, parent_id, name) as (
        select id, parent_id, name from api where id ='${id}'
        union 
        SELECT a.id, a.parent_id, a.name from api a, cnt b WHERE b.id = a.parent_id
      )

      select * from cnt;`
    db.query(sql).then((docs) => {
      console.log('recursive success', docs);
    }).catch(err => {
      console.log(err.message)
    })
  },

  getParent(id) {
    var sql = `with recursive cnt(id, parent_id, name) as (
        select id, parent_id, name from api where id ='${id}'
        union 
        SELECT a.id, a.parent_id, a.name from api a, cnt b WHERE b.parent_id = a.id
      )

      select * from cnt;`
    db.query(sql).then((docs) => {
      console.log('recursive success', docs);
    }).catch(err => {
      console.log(err.message)
    })
  },
}

if(handler[mode]) {
  handler[mode](...arg);
}

