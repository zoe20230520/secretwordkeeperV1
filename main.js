const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

// 确保应用单实例运行
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '密码管理器生成器',
    icon: path.join(__dirname, 'public', 'placeholder-logo.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载应用
  if (app.isPackaged) {
    // 生产环境
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'out', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    // 开发环境
    mainWindow.loadURL('http://localhost:3000');
    // 打开开发者工具
    // mainWindow.webContents.openDevTools();
  }

  // 窗口关闭时触发
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 应用准备就绪后创建窗口
app.on('ready', function() {
  // 注册文件协议，确保生产环境下能正确加载资源
  if (app.isPackaged) {
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(path.join(__dirname, pathname));
    });
  }
  createWindow();
});

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 点击dock图标时重新创建窗口（仅Mac）
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// 单实例处理
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时，聚焦到主窗口
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});