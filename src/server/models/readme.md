1.Document
	_id:{ type: String, required: true }, 
	name: { type: String, required: true }, //文档名称
  table_name:'Document',
  languageId: { type: String, required: true }, //语言Id
  language: { type: String, required: true }, //语言名称
  version: { type: String, required: true },// 版本
  icon: { type: String, required: true },// 小图标
  hide: { type: Boolean, required: true, default: false }, //是否展示
  created_at:{type:Number,}
  updated_at:{type:Number,}
  
2.Api
	_id:{ type: String, required: true }, 
	table_name:'Api'
  name: { type: String, required: true }, //api名称
  type: { type: String, required: true }, // 类型 group或者api
  object_type: { type: Number, required: true },//对象类型 原型方法 静态方法 原型属性 静态属性 对象 无
  parent_id: { type: string, required: true }, //层级
  remark:{type: string, required: true, //备注
  status: { type: Number, required: true }, //API状态 当前 新增 废弃
  sort: { type: Number, default: 99, required: true }, //排序
  code: { type: string, }, //示例代码
  release_status: String,//发布状态
  version_status: { type: Number, required: true }, //文档成熟度 工作草案 候选推荐 推荐
  refer_to: String, //参考文献
  compatibility: Object, //浏览器兼容状态
  document_id: { type: string, ref: 'Document' },
  created_at:{type:Number,}
  updated_at:{type:Number,}

3.Language
	_id:{ type: String, required: true }, 
	table_name:'Language'
  name: { type: String, required: true }, //a
  created_at:{type:Number,}
  updated_at:{type:Number,}

4.Tag
	_id:{ type: String, required: true }, 
	table_name:'Tag'
  name: { type: String, required: true },
  created_at:{type:Number,}
  updated_at:{type:Number,}

5.TagUnionDocument
	_id:{ type: String, required: true }, 
	tag_id:{ type: String, required: true }, 
	document_id:{ type: String, required: true }, 
  created_at:{type:Number,}
  updated_at:{type:Number,}

6.TagUnionApi
	_id:{ type: String, required: true }, 
	tag_id:{ type: String, required: true }, 
	api_id:{ type: String, required: true }, 
  created_at:{type:Number,}
  updated_at:{type:Number,}