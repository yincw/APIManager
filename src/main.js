import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';
import fs from 'fs';
import MenuBuilder from './menu';

import {default as xApi} from './server/services/api';
import {default as xDocument} from './server/services/document';
import {default as xDocumentGroup} from './server/services/documentGroup';
import {default as xLanguage} from './server/services/language';
import {default as xTag} from './server/services/tag';
import {default as xSettings} from './server/services/settings';
import db from './server/models/db';
import logger from './utils/logger';

app.dataProxy = {
  api: xApi,
  document:xDocument,
  language:xLanguage,
  tag:xTag,
  settings: xSettings,
  documentGroup:xDocumentGroup,
}
app.logger = logger;
app.rootDir = process.cwd();

let win;

async function createWindow () {

  await db.sync().then(() => {
    logger.info('connect db success');
  }).catch(err => {
    logger.info('connect db failed ' + err.message)
  });

  win = new BrowserWindow({
    show: false,
    width: 1064,
    height: 768
  });

  const menuBuilder = new MenuBuilder(win);

  if (process.env.electronMode === 'dev') {
    // 开发模式
    win.loadURL('http://localhost:3000/');
    win.webContents.openDevTools();
    win.setMenu(null);
    // menuBuilder.buildMenu();
  } else if (process.env.electronMode === 'preview') {
    // 预览模式，打包前确认
    win.loadURL(url.format({
      pathname: path.join(process.cwd(), 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    // win.webContents.openDevTools();
    win.setMenu(null);
    // menuBuilder.buildMenu();
  } else {
    // 打包模式
    win.loadURL(url.format({
      pathname: path.join(process.resourcesPath, 'app', 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    // win.webContents.openDevTools();
    menuBuilder.buildMenu();
  }

  win.on('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    win = null;
  });

}

// 当所有的窗口被关闭后退出应用
app.on('window-all-closed', () => {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开
  if (win === null) {
    createWindow();
  }
});

app.on('ready', createWindow);
