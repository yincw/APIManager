import React from 'react';
import {default as  BaseResolver} from './base';

export default  class TableResolver extends BaseResolver   {
  constructor(dataSource, template, key) {
    super(dataSource, template, key);
  }
}
