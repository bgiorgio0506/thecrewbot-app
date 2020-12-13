'use strict';
// Import parts of electron to use
const { app, BrowserWindow, autoUpdater, ipcMain, nativeImage, dialog, Tray, Menu, nativeTheme, } = require('electron',);
require('update-electron-app',)();
const path = require('path',);
const ChatBot = require('./js/botLib',);
const log = require('electron-log',);
const settings = require('electron-settings',);
const UISchema = require('./schema/headers.config',).default;
const { EventEmitter, } = require('events',);
const SimConnectApi = require('./js/SimConnectApi',);
const AutoLaunch = require('./js/AutoLaunch',);
const tunnel = require('reverse-tunnel-ssh',);




//Servers
require('./controllers/OAuth2Server/OAuth2Server ',);
require('./schema/settings.config',);
require('./commands/commandsEvents',);




//request app singleInstance
app.requestSingleInstanceLock();

//get audio flag
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required',);

// Add React extension for development
const emitter = new EventEmitter();
const { default: installExtension, REACT_DEVELOPER_TOOLS, } = require('electron-devtools-installer',);
const { TwitchWebhooks, OAuth2Provider, TwitchApi, } = require('./js/twitchLib',);

//refresh token on every open
const OAuth2Client = new OAuth2Provider();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let authWindow;
let gotTheLock;
let appTray;
emitter.setMaxListeners(0,);//set listener to max listener

// Keep a reference for dev mode
let dev = true;




//Init settings
settings.setSync('config.updateLater', false,);
if (settings.getSync('config.channel',)=== undefined) settings.setSync('config.channel', ['paolom346_',],);
if (settings.getSync('config.botPrefix',) === undefined)settings.setSync('config.botPrefix', '!',);

// Determine the mode (dev or production)
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath,) || /[\\/]electron[\\/]/.test(process.execPath,)) {
    if (process.env.APP_DEBUG.includes('true',) === true) dev = true;
    else dev = false;
}
// Temporary fix for broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
    app.commandLine.appendSwitch('high-dpi-support', 'true',);
    app.commandLine.appendSwitch('force-device-scale-factor', '1',);
}
//console.log(path.join(__dirname,'assets/icons/ico/ico.svg'))


/**
 * SingleInstace
 */
//Make single instance here before the whole thing loads!!
if (gotTheLock === false) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    },);
}


/**Dark Mode */
if (settings.getSync('config.isDarkThemeOn',) === true) nativeTheme.themeSource = 'dark';
else nativeTheme.themeSource = 'light';


/**
 * Auto Launch
 * Set app hidden process on start up
 */
if (settings.getSync('config.openOnStreamSetting',) === true) {
    AutoLaunch.enableAutoLaunch();
} else {
    AutoLaunch.disableAutoLaunch();
}

/*** MAIN Window creation ****/
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width          : 1024, // width of the window
        height         : 768, // height of the window
        show           : false, // don't show until window is ready
        frame          : false, //frame less
        resizable      : true,
        webPreferences : {
            nodeIntegration    : true,
            webSecurity        : false,
            enableRemoteModule : true,
        },
        icon : nativeImage.createFromDataURL('file://C:/thecrewbot-app/src/assets/icons/ico/ico1.ico',),
    },);
    // and load the index.html of the app.
    // Load the index.html MAIN_WINDOW_WEBPACK_ENTRY
    mainWindow.loadURL(process.env.MAIN_WINDOW_WEBPACK_ENTRY,);
    // Don't show the app window until it is ready and loaded
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Open the DevTools automatically if developing
        if (dev) {
            installExtension(REACT_DEVELOPER_TOOLS,)
                .catch((err,) => console.log('Error loading React DevTools: ', err,),);
            mainWindow.webContents.openDevTools();
        }
    },);
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
        mainWindow = null;
    },);
}

/**OAuth Window */
function createAuthWindow(path,) {
    log.info(path,);
    // Create the browser window.
    authWindow = new BrowserWindow({
        width          : 400, // width of the window
        height         : 520, // height of the window
        show           : false, // don't show until window is ready
        frame          : true, //frame less
        resizable      : true,
        webPreferences : {
            nodeIntegration    : true,
            webSecurity        : false,
            enableRemoteModule : true,
        },
        icon : nativeImage.createFromDataURL('file://C:/thecrewbot-app/src/assets/icons/ico/ico1.ico',),
    },);

    authWindow.loadURL(path,);

    // Don't show the app window until it is ready and loaded
    authWindow.once('ready-to-show', () => {
        authWindow.show();
        // Open the DevTools automatically if developing
        if (dev) {
            installExtension(REACT_DEVELOPER_TOOLS,)
                .catch((err,) => console.log('Error loading React DevTools: ', err,),);
            authWindow.webContents.openDevTools();
        }
    },);

    // Emitted when the window is closed.
    authWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
        authWindow = null;

        // reload main window after auth
        mainWindow.reload();
    },);
}




/*** EVENT HANDLING AND IPC CALLS ***/

/**App event loop */
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    createWindow();

    await ChatBot.connect();

    /** TRY APP SECTION **/
    //Note tray need to be set on app on ready event
    if (settings.getSync(require('./schema/settings.config',).default.UISchemaState.generalSettings[0].settingsPosition,) === true) {
        appTray = new Tray(path.join(__dirname, 'assets/icons/ico/ico1.ico',),);
        const contextMenu = Menu.buildFromTemplate(require('./schema/appTray.config',).default.ContextMenu,);
        appTray.setContextMenu(contextMenu,);

        appTray.on('double-click', (event,) => {
            mainWindow.show();
            event.preventDefault();
        },);
    }
    /**END TRAY APP SECTION */

    /**Tunnel Section **/
    const port = parseInt(process.env.WEBHOOK_APP_PORT,);
    const serverPort  = parseInt(process.env.SSH_PORT,);
    const config = {
        username          : process.env.SSH_USERNAME,
        host              : process.env.SSH_HOST,
        dstHost           : '0.0.0.0',
        dstPort           : serverPort,
        srcHost           : '127.0.0.1',
        srcPort           : port,
        privateKey        : process.env.SSH_KEY,
        keepaliveInterval : 30000,
        keepaliveCountMax : 5,
    };

    let Tunnel  = tunnel(config, (err, ) => {
        if (err) dialog.showErrorBox('Connection Lost ', 'We have lost the connection between you and the thecrewbot server',);
    },);

    Tunnel.on('forward-in', (port,) => {
        log.info('Forwarding from thecrewbot.it:' + port,);
    },);

    Tunnel.on('close', () => {
        Tunnel  = tunnel(config, (err, ) => {
            if (err) dialog.showErrorBox('Error while closing connection', err,);
        },);
    },);

    /**End */

    /**OAuth Section**/
    //refresh token on every restart
    //wait of it
    await OAuth2Client.refreshOAuth2Token().then(() => {
        log.info('Token Refreshed',);
        return;
    },).catch((err,) => {
        throw err;
    },);

    /**End */


    /**WebHook**/
    const webHook = new TwitchWebhooks();
    try {
    //set url and subscribe to events
        await webHook.setUrl('https://thecrewbot.it',);
        await webHook.subscribeFollows();
        await webHook.subscribeUsers();
        await webHook.subscribeStreams();
        await webHook.subscribeSubs();
    } catch (error) {
        log.error(error,);
    }

    webHook.openDataStream();
    webHook.on('webhook.notification', (notification,) => {
        log.info(JSON.stringify(notification,),);
        mainWindow.webContents.send('webhook.notification', notification,);
    },);
    /**End */

    /**Api req */
    const twitchApi = new TwitchApi();
    setTimeout(async() => {
        try {
            let activeLives  = JSON.parse(await twitchApi.getLives(),);
            if (activeLives.data.length === 1) mainWindow.webContents.send('live-status', true,);
        } catch (err){
            log.error(err,);
        }

    }, 2000,);
    /**End api req */

    /**SimConnect Section **/
    setTimeout(() => {
        SimConnectApi.connectToSim();
    }, 10000,);
    /**End */
},);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
},);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
},);


//Second instance
app.on('second-instance', (event,) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
            mainWindow.focus();
        }
        else
            event.preventDefault();
        mainWindow.show();
    }
},);

/**End app event loop */

/**ipc Event loop */

ipcMain.on('quit-app', function () {
    app.quit();
},);

ipcMain.on('fetch-question-list', () => {
    ChatBot.emit('fetch-question-list',);
    //mainWindow.webContents.send('list-response', questQueue)
},);


ipcMain.on('open-auth', (e, filePath,) => {
    log.info('recived Oauth open',);
    createAuthWindow(`file:///${filePath.path}/${filePath.fileName}`,);
},);

//when a question is marked as completed then delete the element
ipcMain.on('rm-quest', (e, id,) => {
    ChatBot.emit('rm-quest', id,);
    //console.log(questQueue.length) //debug
},);


ipcMain.on('toggle-dark-mode', (e,checked,) => {
    log.info(checked,);
    if (checked === true ){
        nativeTheme.themeSource = 'dark';
    } else nativeTheme.themeSource = 'light';
},);

/**end  ipc event loop*/

/**END IPC SECTION */


/** Classes Event Loop **/
SimConnectApi.on('simconnect-connection-success', () => {
    mainWindow.webContents.send('simconnect-connection-success',);
},);

SimConnectApi.on('simconnect-error', (err,) => {
    console.log(err,);
    mainWindow.webContents.send('simconnect-error', err,);
},);
/** End **/

/**ChatBot event loop */
ChatBot.on('add-quest', (questQueue,) => {
    mainWindow.webContents.send('add-quest', questQueue,);
},);

ChatBot.on('fetch-question-list-res', (questQueue,) => {
    mainWindow.webContents.send('list-response', questQueue,);
},);

ChatBot.on('command-setting-changed', () => {
    mainWindow.webContents.send('command-setting-changed',);
},);

//audio event forward to renedere process
ChatBot.on('play-sound', (AudioPathFile,) => {
    console.log(AudioPathFile,);
},);

/**** END CHATBOT SECTION ****/






/** UPDATER SECTION **/
//GitHub publisher
const server = 'https://update.electronjs.org';
const feed = `${server}/bgiorgio0506/thecrewbot-app/${process.platform}-${process.arch}/${app.getVersion()}`;

ipcMain.on('check-update', () => {
    autoUpdater.setFeedURL(feed,);
    autoUpdater.checkForUpdates();
},);

if (process.env.APP_DEBUG === 'false') {
    autoUpdater.setFeedURL(feed,);

    setInterval(() => {
        autoUpdater.checkForUpdates();
        log.info('Checking Update...',);
    }, 3600000,);

    autoUpdater.on('error', (error,) => {
        log.error('AutoUpdater Error: ',);
        log.error(error.message,);
        log.error(error.stack,);
        log.error(dialog.showErrorBox('Error!', error.message,),);
        UISchema.UISchemaState.isUpdaterDownloading = false;
        //if mainwindow.webcontent are defined
        if (mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState', error,);
    },);

    autoUpdater.on('update-not-available', () => {
        UISchema.UISchemaState.isUpdaterDownloading = false;
        //if mainwindow.webcontent are defined
        if (mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState', UISchema.UISchemaState.isUpdaterDownloading,);

        log.info('update not available',);
    },);


    autoUpdater.on('checking-for-update', () => {
        UISchema.UISchemaState.isUpdaterDownloading = true;
        //if mainwindow.webcontent are defined
        if (mainWindow !== undefined && mainWindow.webContents !== undefined) mainWindow.webContents.send('updateState', true,);
        log.info('checking for update setting UIState to ' + UISchema.UISchemaState.isUpdaterDownloading,);
    },);

    autoUpdater.on('update-available', () => {
        log.info('update available!',);

        autoUpdater.on('update-downloaded', function () {
            // # restart app, then update will be applied
            log.info('update downloaded!',);
            if (settings.getSync('config.updateLater',) === true) return;
            dialog.showMessageBox({ type : 'info', buttons : ['Update now', 'Update Later',], title : 'Update avaliable', message : 'An update is available would you like to update?', },).then((res,) => {
                if (res === 0) return autoUpdater.quitAndInstall();
                else if (res === 1) return settings.set('config.updateLater', true,);
                else return;
            },).catch((err,) => {
                throw err;
            },);
        },);

    },);


}
