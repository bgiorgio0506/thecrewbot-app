// Import dependencies
import React, { useState } from 'react'
import { ipcRenderer } from 'electron'
import getLang from '../../js/langLib';
import utils from '../../helpers/utility'
import UISchema from '../../schema/settings.config'
import { OAuth2Provider } from '../../js/twitchLib'
import path from 'path'
import settings from 'electron-settings'


//modal
import CreateModals from '../common/modal';
import CreateInputModals from '../common/inputModal';

const CreateBotSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [showInputModal, setInputModal] = useState(false);
    const [messageModal, setMessage] = useState('');
    const [channels, setChannels] = useState(settings.getSync('config.channel'));
    const [botPrefix, setPrefix] = useState(settings.getSync('config.botPrefix'));

    let disabled;
    let botPrefixSetting = '';
    let channelAdd = '';
    if (botPrefix === undefined) disabled = false;
    else disabled = true;


    const [prefixInputActive, setActive] = useState(disabled)


    function hideModal() {
        setShowModal(false)
    }

    function handleAdd() {
        console.log('Calling close')
        setInputModal(false)
    }

    function handleClose() {
        console.log('Calling close')
        setInputModal(false)
    }

    //Remove channels
    function removeChannel() {
        let channels = settings.getSync('config.channel');
    }

    //Add channels
    function addChannel() {
        let channels = settings.getSync('config.channel');
    }

    function showInput() {
        setInputModal(true)
    }

    function handleTextInput(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
        console.log(value);
        botPrefixSetting = value;
    }

    function handleChannelInput(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
        console.log(value);
        channelAdd = value;
    }

    //activate prefix and handle setting 
    function activatePrefix() {
        if (prefixInputActive) setActive(false)
        else {
            setActive(true);
            console.log(botPrefixSetting)
            if (botPrefixSetting === '' || botPrefixSetting === null || botPrefixSetting === undefined || botPrefixSetting.length <= 0) {
                setMessage('You inserted a invalid or null prefix')
                setShowModal(true)
                setPrefix(settings.getSync('config.botPrefix'))
            } else {
                settings.setSync('config.botPrefix', botPrefixSetting)
                console.log(settings.getSync('config.botPrefix'))
            }
        }
    }

    return (<div className={"center-panel"}>
        <div className={"settingsSection"}>
            <p className={"section"}>General Bot Settings</p>
            <div className={'generalSettingsDiv'}>
                <p className={"settingLabel"}>Channels</p>
                <p className='note'>*This setting allow you to add one or more channel for the bot to join to</p>
                <div className={"channelList"}>
                    {
                        channels.map((channel) => {
                            return (<div id={channel} className={'channelListWrapper'}>
                                <div className={'channelItem'}>{channel}</div>
                                <div className={'manageChannel'}>x</div>
                                <div className={'manageChannel'} onClick={showInput}>+</div>
                            </div>)
                        })
                    }
                </div>
            </div>
            <div className={'generalSettingsDiv'}>
                <p className={"settingLabel"}>Bot prefix</p>
                <p className='note'>*This setting allow you to change the bot command prefix</p>
                <div className={"inputSettingWrapper"}>
                    <input className={'inputSettingText'} type="text" name="botPrefix" id="botPrefix" defaultValue={botPrefix} disabled={prefixInputActive} onChange={event => handleTextInput(event)} />
                    <div className={'managePrefix'} onClick={activatePrefix}>Modify</div>
                </div>
            </div>
        </div>
        <div className={"settingsSection"}>
            <p className={"section"}>Advanced Setting</p>
        </div>
        <CreateModals show={showModal} handleClose={hideModal}>
            <p className={'modalTitle'}> Information</p>
            <div className={'modalMessage'}>{messageModal}</div>
        </CreateModals>

        <CreateInputModals show={showInputModal} handleAdd={handleAdd} handleCancel={handleClose}>
            <p className={'modalTitle'}> Input Required</p>
            <div className={'inputModalBody'}>
                <div className={'modalMessage'}>Add channel:</div>
                <input className={'inputChannelText'} type="text" name="" id="" onChange={event => handleChannelInput(event)} />
            </div>
        </CreateInputModals>
    </div>)
}

export default CreateBotSettings