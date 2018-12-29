'use strict'
/* eslint-disable */
import { app, BrowserWindow, Menu, ipcMain } from 'electron'
console.log('---------__dirname-----', __dirname)
// 注意这个autoUpdater不是electron中的autoUpdater
import { autoUpdater } from "electron-updater"
 
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          {label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit() }}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        ]
      }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 640,
    useContentSize: true,
    width: 1280
  })

  mainWindow.loadURL(`${winURL}#/login`)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
  //   event.preventDefault()
  //   // 将窗口名解析为窗口位置信息
  //   let position = mainWindow.getPosition()
  //   let size = mainWindow.getSize() || []
  //   let config = {
  //     modal: false,
  //     width: size[0] || 1280,
  //     height: size[1] || 640,
  //   }
  //   let offset = 30
  //   config.x = position[0] + offset
  //   config.y = position[1] + offset
  //   Object.assign(options, config)
  //   console.log('arguments', arguments)
  //   event.newGuest = new BrowserWindow(options)
  //   console.log(111, `${url.replace('/child', '#/child')}`)
  //   event.newGuest.loadURL(`${url.replace('/child', '#/child')}`)
  // })

  mainWindow.openDevTools()
  // 检查更新
  setTimeout(_ => {
    updateHandle(mainWindow)
  }, 3000)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
const uploadUrl = require('../../package.json').build.publish[0].url
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  // mainWindow.webContents.send('message', text)
  console.log(text)
}
let checkTimer = null
function updateHandle(mainWindow) {
  
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  }
 
  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
    // 下载完成，发消息给渲染进程
    mainWindow.webContents.send('update-available', info)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });
 
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    // mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    mainWindow.webContents.send('isUpdateNow')
  });
  ipcMain.on('isUpdateNow', (e, arg) => {
    console.log(arguments)
    console.log("开始更新")
    //some code here to handle event
    autoUpdater.quitAndInstall()
  });
  // 开始5秒后检查一次更新
  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 5000)
  clearInterval(checkTimer)
  // 每10分钟检查一次更新
  checkTimer = setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 600000)
}
/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
