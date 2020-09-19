'use strict'
// Import parts of electron to use
const { app, BrowserWindow, autoUpdater, ipcMain, nativeImage, dialog, Tray, Menu} = require('electron')
require('update-electron-app')()
const utils = require('../src/helpers/utility')
const tmi = require('tmi.js')
const path = require('path');
const log  = require('electron-log')
const settings = require('electron-settings')
const langLib = require('./js/langLib').default
const UISchema  = require('./schema/headers.config').default
const { EventEmitter } = require('events')
const SimConnectApi = require('./js/SimConnectApi');

//request app singleInstance
app.requestSingleInstanceLock()

// Add React extension for development
const emitter = new EventEmitter()
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let gotTheLock;
let langObj = langLib() //get app lang
let appTray;
emitter.setMaxListeners(0);//set listener to max listener

// Keep a reference for dev mode
let dev = true

//Question queue global context
let questQueue = [];
let id = 0;

//SimConnect start connection 
SimConnectApi.connectToSim()

//Init settings
settings.setSync('config.channel', ['paolom346_']);
settings.setSync('config.updateLater', false);
settings.setSync('config.botPrefix', '!');

// Determine the mode (dev or production)
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
 if(process.env.APP_DEBUG.includes('true') === true) dev = true;
 else dev= false;
}
// Temporary fix for broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}
//console.log(path.join(__dirname,'assets/icons/ico/ico.svg'))


/**
 * SingleInstace
 */
//Make single instance here before the whole thing loads!!
if (gotTheLock === false) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus();
    }
  })
}





/*** MAIN Window creation ****/
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, // width of the window
    height: 768, // height of the window
    show: false, // don't show until window is ready
    frame:false, //frame less
    resizable:true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity:false, 
      enableRemoteModule:true
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
  channels:settings.getSync('config.channel')
})

ClientBot.connect().catch((error)=>{throw error;})

ClientBot.on('message', (channel, tags, message, self)=>{

  //Command sys
  let prefix = settings.getSync('config.botPrefix')// get settings 
  let messageArr = message.split(' ')//split the message into array

  //get only bot command
  console.log(messageArr[0].includes('!'))
  if(messageArr[0].includes(prefix) !== true) return;
    const args = messageArr[0].slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

  //log.info(message, tags, channel, self)
  if(command === 'domanda'){
      let questObj = {}
      let messageArr = message.split(' '); // split the string into an Array
      messageArr.shift();// remove command string from message content
      let quest = messageArr.join(' '); //join array
      id = id+1// increment questId
      //check if the same question is in the array
      console.log(questQueue.length)
      if(questQueue.length > 0){
        questQueue.map((item)=>{
          if(item.question.includes(quest) === true){
            ClientBot.say(channel, langObj.botMess[2]+ item.user) //say no to the user
          }else{
            //build elements and push for render
            questObj  = { id :id, user:tags.username, question:quest}
            questQueue.push(questObj);
            questQueue = utils.filterObjArr(questQueue)
            console.log(questQueue)
            mainWindow.webContents.send('add-quest',questQueue)// send event to UI
          }
        })
      }else{
        console.log('Calling here')
        //if the array is empty take the first question
        questObj  = { id : id, user:tags.username, question:quest}
        questQueue.push(questObj);// push before render is committed
        mainWindow.webContents.send('add-quest',questQueue)
      }
  }

  //status command
  if(command === "status"){
    if (questQueue.length > 0) {
     let index = utils.findIndexInObjArr(questQueue, 'user', tags.username) //find the question in the erray
     if (index === -1) {
       ClientBot.say(channel,langObj.botMess[0]) // 404 not found
     } else {
        index = index+1;
        ClientBot.say(channel, langObj.botMess[1] + index + langObj.symbols[0]) //send position in the array 
      }
    }else  ClientBot.say(channel,langObj.botMess[0])
  }

  if(command === "donate"){
    ClientBot.say(channel, 'Il link per le donazioni è https://streamlabs.com/paolom346_/tip '+'  Grazie per il supporto '+ tags.username+ ' !!')
  }
})

ClientBot.on('connected', ()=>{
  log.info('Joined channel & listening ');
})


/**** END CHATBOT SECTION ****/


/*** EVENT HANDLING AND IPC CALLS ***/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  /** TRY APP SECTION **/
  //Note tray need to be set on app on ready event
  if (settings.getSync(require('./schema/settings.config').default.UISchemaState.generalSettings[0].settingsPosition) === true) {
    appTray = new Tray(path.join(__dirname, 'assets/icons/ico/ico1.ico'));
    const contextMenu = Menu.buildFromTemplate(require('./schema/appTray.config').default.ContextMenu)
    appTray.setContextMenu(contextMenu);

    appTray.on('double-click', (event) => {
      mainWindow.show();
      event.preventDefault();
    })
  }
  /**END TRAY APP SECTION */
})

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

//when a question is marked as completed then delete the element
ipcMain.on('rm-quest', (e ,id)=>{
  questQueue = questQueue.filter(item => item.id !== id)
  //console.log(questQueue.length) //debug
})

//Second instance 
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
      mainWindow.focus();
    }
    else
      event.preventDefault()
    mainWindow.show()
  }
})


ipcMain.on('quit-app', function () {
  app.quit();
});

ipcMain.on('fetch-question-list', ()=>{
  mainWindow.webContents.send('list-response', questQueue)
})


/**END IPC SECTION */


/** UPDATER SECTION **/
//GitHub publisher
const server = 'https://update.electronjs.org'
const feed = `${server}/bgiorgio0506/thecrewbot-app/${process.platform}-${process.arch}/${app.getVersion()}`
if(dev === true){
  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    autoUpdater.checkForUpdates()
    log.info('Checking Update...')
  }, 3600000)

  autoUpdater.on("error", error => {
    log.error("AutoUpdater Error: ");
    log.error(error.message);
    log.error(error.stack);
    log.error(dialog.showErrorBox("Error!", error.message));
    UISchema.UISchemaState.isUpdaterDownloading = false
    //if mainwindow.webcontent are defined
    if(mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState', error)
  });

  autoUpdater.on("update-not-available", info => {
    UISchema.UISchemaState.isUpdaterDownloading = false
   //if mainwindow.webcontent are defined
   if(mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState',  UISchema.UISchemaState.isUpdaterDownloading)
  
    log.info("update not available");
  });

  
  autoUpdater.on("checking-for-update", () => {
    UISchema.UISchemaState.isUpdaterDownloading = true
   //if mainwindow.webcontent are defined
   if(mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState', true)
    log.info("checking for update setting UIState to " + UISchema.UISchemaState.isUpdaterDownloading);
  });

  autoUpdater.on('update-available', () => {
    log.info("update available!");

    autoUpdater.on('update-downloaded', function (event, releaseName) {
      // # restart app, then update will be applied
      log.info("update downloaded!");
    if(settings.getSync('config.updateLater')=== true)return;
      dialog.showMessageBox({type:'info', buttons:['Update now', 'Update Later'], title:'Update avaliable', message:'An update is available would you like to update?'}).then((res)=>{
        if(res === 0 ) return autoUpdater.quitAndInstall();
        if(res === 1) settings.set('config.updateLater', true)
      })
    });

  });


}