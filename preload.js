// 预加载脚本，用于在渲染进程中安全地访问Node.js功能
const { contextBridge } = require('electron');

// 暴露安全的API到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 可以在这里添加需要暴露的功能
  // 例如：文件系统操作、系统信息等
});