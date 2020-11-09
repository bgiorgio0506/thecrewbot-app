// Import dependencies
import React, { useState, } from 'react';
import { ipcRenderer, } from 'electron';
import utils  from '../helpers/utility';
import UISchema  from '../schema/settings.config';
import { OAuth2Provider, } from '../js/twitchLib';
import path from 'path';


//Modal component
import CreateModals from '../components/common/modal';

const CreateSettings = () => {
    let LangLabelsArray  = UISchema.UISchemaState.langLabels;
    const [startSettings, setStartCheckBox,] = useState(UISchema.UISchemaState.generalSettings[1].checked,);
    const [traySettings, setTrayCheckBox,] = useState(UISchema.UISchemaState.generalSettings[0].checked,);
    const [showModal, setShowModal,] = useState(false,);
    const [messageModal, setMessage,] = useState('',);


    function hideModal(){
        setShowModal(false,);
    }

    return (<div className = "center-panel">
        <div className = "settingsSection">
            <p className = 'section'>General</p>
            {
                UISchema.UISchemaState.generalSettings.map((setting,) => {
                    return (
                        <div key={setting.id} className ="generalSettingsDiv">
                            <label htmlFor={setting.id}>{setting.lebelText}</label>
                            <input type={setting.inputType} checked= {(setting.id.includes('minimizeOnTrayChkBox',) === true) ? traySettings : startSettings } className = {setting.className} id= {setting.id} onChange={(event,) => {
                                if (setting.id.includes('minimizeOnTrayChkBox',) === true) setTrayCheckBox(event.target.checked,);
                                else setStartCheckBox(event.target.checked,);
                                setting.onToggleChecked(event.target.checked, setting.settingsPosition,);
                            }}/>
                            <br/>
                        </div>);
                },)
            }

        </div>
        <div className = "settingsSection">
            <p className= 'section'>Language</p>
            <select name="lang" id="lang" value={UISchema.UISchemaState.langSetting.currentSetting} onChange= {(e,) => {
                UISchema.UISchemaState.langSetting.onToggleChecked(e.target.value,);
            }}>
                {
                    LangLabelsArray.map((langLabel,) => {
                        return (<option key={langLabel.value} value ={langLabel.value}>{langLabel.label}</option>);
                    },)
                }
            </select>
        </div>
        <div className = "settingsSection">
            <p className= 'section'>Twitch</p>
            <p className= 'note'>*This button will connect the application to twitch</p>
            <button className="twitchBtn" onClick={() => {
                //Let's start OAuth2 flow
                const OAuth2Strategy = new OAuth2Provider();
                OAuth2Strategy.startOAuth2Strategy().then((res,) => {
                    if (typeof res !== 'object'){
                        return utils.writeFile('OAuth.html', res,).then(() => {
                            return ipcRenderer.send('open-auth',{ path : path.join(process.env.APPDATA,'thecrewbot-app\\Temp%20Folder\\',), fileName : 'OAuth.html', },);
                        },).catch((err,) => {
                            throw err;
                        },);
                    }
                    else {
                        //ipcRenderer.send('open-auth',{path:path.join(process.env.APPDATA,'thecrewbot-app\\Temp%20Folder\\'), fileName: 'OAuth.html'})
                        setShowModal(true,);
                        return setMessage('It happears you have already connected your account',);

                    }
                },).catch((err,) => {
                    console.log(err,);
                    return setMessage(err,);
                },);
            }}><p>Twitch <i className="fab fa-twitch"></i></p></button>
        </div>
        <div className = "settingsSection">
            <p className= 'section'>About</p>
            <p className="note">{'You are on version '+process.env.APP_VERSION}</p>
            <button className="checkBtn" onClick={() => {
                ipcRenderer.send('check-update',);
            }}>Check Update</button>
        </div>
        <CreateModals show={showModal} handleClose={hideModal}>
            <p className={'modalTitle'}> Information</p>
            <div className={'modalMessage'}>{messageModal}</div>
        </CreateModals>
    </div>);
};

export default CreateSettings;
