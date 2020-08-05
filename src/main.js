'use strict'
// Import parts of electron to use
const { app, BrowserWindow, autoUpdater, ipcMain} = require('electron')
require('update-electron-app')()
require('dotenv').config()
const utils = require('../src/helpers/utility')
const tmi = require('tmi.js');
// Add React extension for development
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// Keep a reference for dev mode
let dev = true
//Question queue
let questQueue = [];
let questID = 0; //init id

// Determine the mode (dev or production)
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}
// Temporary fix for broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, // width of the window
    height: 768, // height of the window
    show: false, // don't show until window is ready
    webPreferences: {
      nodeIntegration: true,
      preload : __dirname+'/preload.js'
    },
    icon:'./src/assets/icons/ico/ico1.ico'
  })
  // and load the index.html of the app.
  // Load the index.html
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  // Don't show the app window until it is ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Open the DevTools automatically if developing
    if (dev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

/** CHAT BOT SECTION **/
//chatbot opts 
const ClientBot = new tmi.Client({
  options: { debug: true },
connection: {
      reconnect: true,
      secure: true
},
  identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_BOT_PASSWORD,
  },
  channels:['paolom346_']
})

ClientBot.connect().catch((error)=>{throw error;})

ClientBot.on('message', (channel, tags, message, self)=>{
  //console.log(message, tags, channel, self)
  if(message.includes('!secret') === true){
      let messageArr = message.split(' '); // split the string into an Array
      messageArr.shift();// remove command string from message content
      let quest = messageArr.join(' '); //join array
      let questObj  = { id :questQueue.length, user:tags.username, question:quest, position: questQueue.length+1, complete: false}
      // add to queue array
      //console.log(questQueue) // debug log
      questQueue.push(questObj);// push before render is committed
      mainWindow.webContents.send('add-quest',questQueue)
      ClientBot.say(channel, '***Test Message ***\n  Grazie '+ questObj.user +' la tua secret è al : '+ questQueue.length+ '°' + ' in ordine!!\n Aspetta e tutto ti sarà dato'); //send user response
  }

  if(message.includes('!status') === true){
    if (questQueue.length > 0) {
     let index = utils.findIndexInObjArr(questQueue, 'user', tags.username)
     if (index === -1) {
       ClientBot.say(channel,'Non abbiamo trovato la tua ****')
     } else {
        index = index+1;
        ClientBot.say(channel,'La tua **** al ' + index + '°')
      }
    }else  ClientBot.say(channel,'Non abbiamo trovato la tua ****')
  }

  if(message.includes('!social') === true){
    ClientBot.say(channel, 'Trovami in tutti i social quì: https://linktr.ee/paolom346')
  }

  if(message.includes('!donazioni') === true){
    ClientBot.say(channel, 'Il link per le donazioni è https://streamlabs.com/paolom346_/tip '+'  Grazie per il supporto '+ tags.username+ ' !!')
  }
})

ClientBot.on('connected', ()=>{
  console.log('Joined channel')
})

ipcMain.on('rm-quest', (e ,id)=>{
  questQueue = questQueue.filter(item => item.id !== id);
})
//setInterval(()=>{
//  ClientBot.say('paolom346_','*****This is a test***** \nfrom' + process.env.APP_NAME + '\n  version: ' + process.env.APP_VERSION + '\n on platform: ' + process.platform+ '\n Debug : '+ process.env.APP_DEBUG)
//}, 60000)



//Updater Section 
const server = 'https://update.electronjs.org'
const feed = `${server}/bgiorgio0506/thecrewbot-app/${process.platform}-${process.arch}/${app.getVersion()}`
if(dev === false){
  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)

}