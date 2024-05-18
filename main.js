const { app, BrowserWindow, ipcMain, BaseWindow, WebContentsView  } = require('electron');
const path = require('path');
const express = require('express');
const server = express();
const { spawn } = require('child_process');
const { initApp } = require('./proxy');

/**
server.use('/', express.static('./web/build'));
server.listen(3000, () => {
  console.log('server run in port 3000')
});
 */
// initApp(9001, '192.168.5.1');
const createWindow = () => {
  const win = new BrowserWindow({
    icon: '/app_icons/icon.png',
    // frame: false,
    width: 800,
    height: 900,
    webPreferences: {
      devTools: true
    },
    // transparent: true,
    webPreferences: {
      preload: path.resolve(__dirname, './preload.js')
    }
  })
  // // initApp(12345, '192.168.7.1');
  // // win.loadFile('./web/build/index.html')
  // win.loadURL('http://localhost:9001')
  win.loadURL('http://localhost:3000')
  // const win = new BaseWindow({ width: 800, height: 900 })

  // const view1 = new WebContentsView()
  // win.contentView.addChildView(view1)
  // view1.webContents.loadURL('http://localhost:9001')
  // view1.setBounds({ x: 0, y: 0, width: 400, height: 800 })

  // const view2 = new WebContentsView()
  // win.contentView.addChildView(view2)
  // view2.webContents.loadURL('http://localhost:9001')
  // view2.setBounds({ x: 400, y: 0, width: 400, height: 800 })

  win.once('ready-to-show', () => {
    win.webContents.openDevTools();
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('ping', (event, data) => {
    console.log(`get message from render: ${data}`);
    return 'pong';
  })
  ipcMain.on('msg-from-renderer', (event, arg) => {
    console.log('msg-from-renderer:', arg); // 输出渲染进程发送的消息
    event.reply('message-to-renderer', 'Hello from main process!')
  })
  let child = null;
  ipcMain.on('start-serve', (event, cfg) => {
    console.log('-------- start-serve -------------', cfg); // 输出渲染进程发送的消息
    try {
      child = spawn('node', ['proxy.js', '--port',cfg.port, '--ip', cfg.proxyIPAddress]);
      event.reply('start-serve-ok', Date.now())
      console.log('-------- start-serve-ok -------------'); // 输出渲染进程发送的消息
    } catch (error) {
      event.reply('start-serve-fail')
    }
    // initApp(cfg.port, cfg.proxyIPAddress);
  })
  ipcMain.on('stop-serve', (event) => {
    try {
        child.kill();
        console.log('-------- stop-serve -------------')
        event.reply('stop-serve-ok');
    } catch (error) {
        
    }
  })
  // 如果没有窗口打开则打开一个窗口 (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', _ => {
  if (process.platform != 'drawin') {
    console.log('window-all-closed');
    app.quit();
  }
})