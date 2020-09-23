// Import dependencies
import React from 'react'
import { ipcRenderer , shell} from 'electron'
import getLang from '../js/langLib';
import utils  from '../helpers/utility'
import UISchema  from '../schema/settings.config'
import {OAuth2Provider} from '../js/twitchLib' 
import path from 'path'


const CreateSettings = ()=>{
    let LangLabelsArray  = UISchema.UISchemaState.langLabels
    return (<div className = "center-panel">
        <div className = "settingsSection">
            <p className = 'section'>General</p>
            {
                UISchema.UISchemaState.generalSettings.map((setting)=>{
                    console.log(setting.checked)
                return(
                <div className ="generalSettingsDiv">
                    <label htmlFor={setting.id}>{setting.lebelText}</label>
                    <input type={setting.inputType} checked= {setting.checked} className = {setting.className} id= {setting.id} onChange={()=>{
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
            <select name="lang" id="lang" value={UISchema.UISchemaState.langSetting.currentSetting} onChange= {(e)=>{
                UISchema.UISchemaState.langSetting.onToggleChecked(e.target.value)
            }}>
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
            <button className="twitchBtn" onClick={(event)=>{
                //Let's start OAuth2 flow 
                const OAuth2Strategy = new OAuth2Provider()
                OAuth2Strategy.startOAuth2Strategy().then((res)=>{
                    console.log(res)
                    if(typeof res !== 'object') utils.writeFile('OAuth.html', res).then((res)=>{
                        console.log(res)
                       ipcRenderer.send('open-auth',{path:path.join(process.env.APPDATA,'thecrewbot-app\\Temp%20Folder\\'), fileName: 'OAuth.html'})
                    })
                }).catch((err)=>{
                    console.log(err)
                })
            }}><p>Twitch <i class="fab fa-twitch"></i></p></button>
        </div>
        <div className = "settingsSection">
            <p className= 'section'>About</p>
            <p className="note">{'You are on version '+process.env.APP_VERSION}</p>
            <button className="checkBtn">Check Update</button>
        </div>
    </div>)
}

export default CreateSettings