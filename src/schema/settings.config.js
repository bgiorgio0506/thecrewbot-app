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
                checked : false,
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
                lebelText : 'Start application on stream',
                settingsPosition :'config.openOnStreamSetting', 
                checked : false,
                onToggleChecked : (checked, position)=>{
                    console.log(checked)
                    if(checked) return settings.setSync(position, true)
                    else return settings.setSync(position, false)
                }
            }
        ]
    }
}

export default schema