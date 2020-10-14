const AutoLaunch = require('auto-launch')
const {app} = require('electron')

//Init AutoLaunch
let appAutoUpdater = new AutoLaunch({
    name: app.getName(),
    path: app.getPath('exe'),
    isHidden:false
})

//Enable Auto Launcher
exports.enableAutoLaunch  = () =>{

    appAutoUpdater.isEnabled().then((isEnabled)=>{
        if(!isEnabled) return appAutoUpdater.enable();
    })

}

//disable Auto updater
exports.disableAutoLaunch = ()=>{
    appAutoUpdater.isEnabled().then((isEnabled)=>{
        if(isEnabled) return appAutoUpdater.disable()
    })
}



