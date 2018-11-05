// 'use strict'

import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} from 'electron'
const io = require('socket.io')()
const path = require('path')

// 防止被垃圾回收
let appIcon

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
const isDev = process.env.NODE_ENV === 'development'
let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

let shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // 当另一个实例运行的时候，这里将会被调用，我们需要激活应用的窗口
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    if (!mainWindow.isVisible()) mainWindow.show()
    mainWindow.focus()
    // if (tray) {
    //     win.isVisible() && tray.destroy();
    // }
  }
  return true
})
// 这个实例是多余的实例，需要退出
if (shouldQuit) {
  app.quit()
  // return
}

function createWindow() {

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 600,
    backgroundColor: '#f5f5f5',
    fullscreenable: false,
    frame: true,
    show: true // isDev ? true : false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', (e) => {
    // e.preventDefault()
    // mainWindow.hide()
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log(123333)
  io.close()
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
 * main 与 render 交互
 */

// ipcMain.on('new-win-print', function (event, arg) {
//   if (printers.map(d => d.name).indexOf(arg.printMachine) === -1) {
//       event.sender.send('echo-process', {
//           type: 'print-error',
//           data: printers
//       })
//       return false;
//   } else {
//       printArr.push(printFor(event, arg));
//       executePrint();
//   }
// })

// web 加载完成 默认开启socket
ipcMain.on('web-created', function (event) {
  console.log('web-created')
  event.sender.send('echo-process', {
    type: 'printers',
    data: mainWindow.webContents.getPrinters()
  })
})

ipcMain.on('app-back', () => {
  if (appIcon) appIcon.destroy()
  const iconName = 'win-trayicon.ico'
  const iconPath = path.join(`${__dirname}/src/tray/`, iconName)
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([{
    label: '显示窗口',
    click: function () {
      mainWindow.show()
    }
  }, {
    label: '退出',
    click: function () {
      if (appIcon) appIcon.destroy()
      if (process.platform !== 'darwin') {
        app.quit()
      }
    }
  }])
  appIcon.on('click', function () {
    mainWindow.show()
  })
  appIcon.setToolTip('城市用血实时联网平台')
  appIcon.setContextMenu(contextMenu)
  mainWindow.hide()
})
ipcMain.on('app-show', () => {
  mainWindow.show()
})
ipcMain.on('app-quit', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const socketConnect = function () {
  mainWindow.webContents.send('scoket-connect', 'nihao')
}

const disConnect = function () {
  mainWindow.webContents.send('dis-connect', 'nihao')
}
/**
 * main 与 render 交互
 */

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
// socket 打印的开始部分
const printArr = [] // 用于保存打印队列
let isPrint = false // 当前是否处于打印机工作状态
/**
 * 尝试执行打印
 */
const executePrint = () => {
  if (!isPrint && printArr.length > 0) {
    printArr[0]()
  }
}
/**
 * 执行一次打印机打印
 */
const printFor = (arg, socket) => {
  return function () {
    isPrint = true
    const printWin = new BrowserWindow({
      minWidth: 1280,
      minHeight: 720,
      backgroundColor: '#f5f5f5',
      fullscreenable: false,
      frame: true,
      show: isDev ? true : false
    })
    printWin.loadURL(`${arg.url}`)
    // printWin.loadURL(`http://192.168.110.64/views/print/${arg.template}.html?data=${arg.data}`)
    printWin.webContents.openDevTools()
    printWin.webContents.on('did-finish-load', function () {
      if(!isDev){
        printWin.webContents.print({
          silent: true, // 是否不向用户询问设置
          printBackground: false, // 打印网页的背景颜色和图像
          deviceName: arg.printMachine // 打印设备的名称
        })
      }
      setTimeout(function () {
        socket.emit('print-succ', {
          type: 'succ',
          text: '打印成功！',
          data: arg
        })
        // printWin.close()
        isPrint = false
        printArr.shift()
        executePrint()
      }, 4000)
    })
  }
}

// socket 打印的结束

// socket 启动程序立即开启socket 服务
io.on('connection', function (socket) {
  socketConnect()
  socket.on('print', (arg) => {
    printArr.push(printFor(arg, socket))
    executePrint()
  })
  // 断开连接时
  socket.on('disconnect', () => {
    disConnect()
  })

  // 监听已连接
  socket.on('socket-connect', () => {
    socketConnect()
    socket.emit('get-printers', mainWindow.webContents.getPrinters())
  })
})
io.listen(3000)
