// Import dependencies
import React from 'react'
import { ipcRenderer } from 'electron'
import store from 'electron-store'
import settings from 'electron-settings'
import getLang from '../js/langLib';
import UISchema  from '../schema/settings.config'


const CreateSettings = ()=>{
    let LangLabelsArray  = UISchema.UISchemaState.langLabels
    return (<div class = "center-panel">
        <div class = "settingsSection">
            <p class = 'section'>General</p>
            <label htmlFor="minimizeOnTrayChkBox">Minimize on System tray on close</label>
            <input type="checkbox" name="minimizeOnTray" id="minimizeOnTrayChkBox"/>
            <br/>
            <label htmlFor="minimizeOnTrayChkBox">Start application on stream</label>
            <input type="checkbox" name="minimizeOnTray" id="minimizeOnTrayChkBox"/>
        </div>
        <div class = "settingsSection">
            <p class= 'section'>Language</p>
            <select name="lang" id="lang">
                {
                    LangLabelsArray.map((langLabel)=>{
                    return(<option value ={langLabel.value}>{langLabel.label}</option>)
                    })
                }
            </select>
        </div>
        <div class = "settingsSection">
            <p class= 'section'>Twitch</p>
            <p>*This button will connect the application to twitch</p>
            <button class="twitchBtn"><p>Twitch <i class="fab fa-twitch"></i></p></button>
        </div>
        <div class = "settingsSection">
            <p class= 'section'>About</p>
            <p>{'You are on version:'+process.env.APP_VERSION}</p>
            <button class="checkBtn">Check Update</button>
        </div>
    </div>)
}

export default CreateSettings