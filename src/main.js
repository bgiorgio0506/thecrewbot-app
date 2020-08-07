'use strict'
// Import parts of electron to use
const { app, BrowserWindow, autoUpdater, ipcMain, nativeImage} = require('electron')
require('update-electron-app')()
const utils = require('../src/helpers/utility')
const tmi = require('tmi.js')
const path = require('path');
const log  = require('electron-log')
// Add React extension for development
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// Keep a reference for dev mode
let dev = false
//Question queue
let questQueue = [];

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
console.log(path.join(__dirname,'assets/icons/ico/ico.svg'))

/*** MAIN Window creation ****/
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, // width of the window
    height: 768, // height of the window
    show: false, // don't show until window is ready
    webPreferences: {
      nodeIntegration: true,
      webSecurity:false
    },
    icon: nativeImage.createFromDataURL("file://C:/thecrewbot-app/src/assets/icons/ico/ico1.ico"),
  })
  // and load the index.html of the app.
  // Load the index.html MAIN_WINDOW_WEBPACK_ENTRY
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
  log.info(message, tags, channel, self)
  if(message.includes('!domanda') === true){
      let questObj = {}
      let messageArr = message.split(' '); // split the string into an Array
      messageArr.shift();// remove command string from message content
      let quest = messageArr.join(' '); //join array
      //check if the same question is in the array
      if(questQueue.length > 0){
        questQueue.map((item)=>{
          if(item.question.includes(quest) === true){
            ClientBot.say(channel, 'Attenzione domanda già fatta da: '+ item.user) //say no to the user
          }else{
            //build elements and push for render
            questObj  = { id :questQueue.length, user:tags.username, question:quest, position: questQueue.length+1, complete: false}
            questQueue.push(questObj);
            mainWindow.webContents.send('add-quest',questQueue)// send event to UI
          }
        })
      }else{
        //if the array is empty take the first question
        questObj  = { id :questQueue.length, user:tags.username, question:quest}
        questQueue.push(questObj);// push before render is committed
        mainWindow.webContents.send('add-quest',questQueue)
      }
  }

  //status command
  if(message.includes('!status') === true){
    if (questQueue.length > 0) {
     let index = utils.findIndexInObjArr(questQueue, 'user', tags.username) //find the question in the erray
     if (index === -1) {
       ClientBot.say(channel,'Non abbiamo trovato la tua domanda') // 404 not found
     } else {
        index = index+1;
        ClientBot.say(channel,'La tua domanda al ' + index + '°') //send position in the array 
      }
    }else  ClientBot.say(channel,'Non abbiamo trovato la tua domanda')
  }

  if(message.includes('!social') === true){
    ClientBot.say(channel, 'Trovami in tutti i social quì: https://linktr.ee/paolom346')
  }

  if(message.includes('!donazioni') === true){
    ClientBot.say(channel, 'Il link per le donazioni è https://streamlabs.com/paolom346_/tip '+'  Grazie per il supporto '+ tags.username+ ' !!')
  }
})

ClientBot.on('connected', ()=>{
  log.info('Joined channel & listening ');
})


/**** END CHATBOT SECTION ****/


/*** EVENT HANDLING AND IPC CALLS ***/
//when a question is marked as completed then delete the element
ipcMain.on('rm-quest', (e ,id)=>{
  let index = utils.findIndexInObjArr(questQueue, 'id', id) // find element in the array
  delete questQueue[index]; //delete element
  //console.log(questQueue) //debug
})




/** UPDATER SECTION **/
//GitHub publisher
const server = 'https://update.electronjs.org'
const feed = `${server}/bgiorgio0506/thecrewbot-app/${process.platform}-${process.arch}/${app.getVersion()}`
if(dev === false){
  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)

}