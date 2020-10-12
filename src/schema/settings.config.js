import React, {Fragment} from 'react'
import settings from 'electron-settings'

const schema = {
    UISchemaState:{
        langLabels: [{value:'en', label:'English'}, {value:'it', label:'Italian'}], 
        generalSettings : [
            {
                id: 'minimizeOnTrayChkBox', 
                inputType  :'checkbox', 
                className : 'checkBoxBtn',
                lebelText : 'Minimize on System tray on close',
                settingsPosition : 'config.minimizeTraySetting',
                checked : settings.getSync('config.minimizeTraySetting'),
                onToggleChecked : (checked, position)=>{
                    console.log(checked)
                    if(checked){
                        return settings.setSync(position, true)
                    }
                    else return settings.setSync(position, false)
                }
            },
            {
                id: 'startAppOnStreamChkBox', 
                inputType  : 'checkbox', 
                className : 'checkBoxBtn',
                lebelText : 'Start application on startup',
                settingsPosition :'config.openOnStreamSetting', 
                checked : settings.getSync('config.openOnStreamSetting'),
                onToggleChecked : (checked, position)=>{
                    console.log(checked)
                    if(checked) return settings.setSync(position, true)
                    else return settings.setSync(position, false)
                }
            }
        ], 
        langSetting: {
            id : 'lang',
            settingsPosition : 'config.lang', 
            currentSetting : settings.getSync('config.lang'),
            onToggleChecked : (setting)=>{
                console.log(setting)
                settings.setSync('config.lang', setting)
            }
        }, 
        botSettings: [
            {
                id: 'useDefaultCommands', 
                inputType  :'checkbox', 
                className : 'checkBoxBtn',
                lebelText : 'Use default commands',
                settingsPosition : 'config.useDefaultCommands',
                checked : settings.getSync('config.useDefaultCommands'),
                onToggleChecked : (checked, position)=>{
                    console.log(checked)
                    if(checked){
                        return settings.setSync(position, true)
                    }
                    else return settings.setSync(position, false)
                }
            }
        ]
    }
}

export default schema