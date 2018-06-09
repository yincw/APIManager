import { app, Menu, shell, BrowserWindow } from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.electronMode === 'dev'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin'
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'API 文档管理平台',
      submenu: [
        {
          label: '关于 API 文档管理平台',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: '服务', submenu: [] },
        { type: 'separator' },
        {
          label: '隐藏 API 文档管理平台',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: '隐藏其它',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: '显示所有', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'Command+Z', selector: 'undo:' },
        { label: '重做', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: '剪贴', accelerator: 'Command+X', selector: 'cut:' },
        { label: '复制', accelerator: 'Command+C', selector: 'copy:' },
        { label: '粘贴', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: '选择所有',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    };
    const subMenuViewDev = {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: '切换全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: '切换开发工具',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd = {
      label: '视图',
      submenu: [
        {
          label: '切换全屏',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        }
      ]
    };
    const subMenuWindow = {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: '关闭', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: '前置窗口', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: '帮助',
      submenu: [
        {
          label: '学习更多',
          click() {
            shell.openExternal('http://electron.atom.io');
          }
        },
        {
          label: '文档',
          click() {
            shell.openExternal(
              'https://github.com/atom/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: '社区讨论',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron');
          }
        },
        {
          label: '搜索问题',
          click() {
            shell.openExternal('https://github.com/atom/electron/issues');
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

      // return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
      return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '文件',
        submenu: [
          {
            label: '打开',
            accelerator: 'Ctrl+O'
          },
          {
            label: '关闭',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '视图',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '重新加载',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: '切换全屏',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: '切换开发者工具',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: '切换全屏',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      // {
      //   label: '帮助',
      //   submenu: [
      //     {
      //       label: '学习更多',
      //       click() {
      //         shell.openExternal('http://electron.atom.io');
      //       }
      //     },
      //     {
      //       label: '文档',
      //       click() {
      //         shell.openExternal(
      //           'https://github.com/atom/electron/tree/master/docs#readme'
      //         );
      //       }
      //     },
      //     {
      //       label: '社区讨论',
      //       click() {
      //         shell.openExternal('https://discuss.atom.io/c/electron');
      //       }
      //     },
      //     {
      //       label: '搜索问题',
      //       click() {
      //         shell.openExternal('https://github.com/atom/electron/issues');
      //       }
      //     }
      //   ]
      // }
    ];

    return templateDefault;
  }
}
