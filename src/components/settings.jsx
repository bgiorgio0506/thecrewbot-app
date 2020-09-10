// Import dependencies
import React from 'react'
import { ipcRenderer } from 'electron'
import store from 'electron-store'
import settings from 'electron-settings'
import getLang from '../js/langLib';
import UISchema  from '../schema/settings.config'


const CreateSettings = ()=>{
    let LangLabelsArray  = UISchema.UISchemaState.langLabels
    return (<div className = "center-panel">
        <div className = "settingsSection">
            <p className = 'section'>General</p>
            {
                UISchema.UISchemaState.generalSettings.map((setting)=>{
                return(
                <div className ="generalSettingsDiv">
                    <label htmlFor={setting.id}>{setting.lebelText}</label>
                    <input type={setting.inputType} className = {setting.className} id= {setting.id} onChange={()=>{
                        setting.checked = !setting.checked
                        setting.onToggleChecked(setting.checked, setting.settingsPosition)
                        }}/>
                    <br/>
                </div>)
                })
            }
           
        </div>
        <div className = "settingsSection">
            <p className= 'section'>Language</p>
            <select name="lang" id="lang">
                {
                    LangLabelsArray.map((langLabel)=>{
                    return(<option value ={langLabel.value}>{langLabel.label}</option>)
                    })
                }
            </select>
        </div>
        <div className = "settingsSection">
            <p className= 'section'>Twitch</p>
            <p className= 'note'>*This button will connect the application to twitch</p>
            <button className="twitchBtn"><p>Twitch <i class="fab fa-twitch"></i></p></button>
        </div>
        <div className = "settingsSection">
            <p className= 'section'>About</p>
            <p className="note">{'You are on version '+process.env.APP_VERSION}</p>
            <button className="checkBtn">Check Update</button>
        </div>
    </div>)
}

export default CreateSettings