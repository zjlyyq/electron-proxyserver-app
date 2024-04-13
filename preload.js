const { contextBridge } = require('electron');

// 通过 versions 全局变量，将 Electron 的 process.versions 对象暴露给渲染器。
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // 除函数之外，我们也可以暴露变量
})