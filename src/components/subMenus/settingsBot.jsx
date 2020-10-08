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
import CreateModals from '../common/modal'

const CreateBotSettings = () => {
    const [showModal, setShowModal] = useState(false);
    const [messageModal, setMessage] = useState('')
    const [channels, setChannels] = useState(settings.getSync('config.channel'))

    function hideModal() {
        setShowModal(false)
    }

    //Remove channels
    function removeChannel() {
        let channels = settings.getSync('config.channel');
    }

    //Add channels
    function addChannel() {
        let channels = settings.getSync('config.channel');
    }

    return (<div className={"center-panel"}>
        <div className={"settingsSection"}>
            <p className={"section"}>General Bot Settings</p>
            <div className={'generalSettingsDiv'}>
                <p className={"settingLabel"}>Channels</p>
                <div className={"channelList"}>
                    {
                        channels.map((channel) => {
                            return (<div id={channel} className={'channelListWrapper'}>
                                <div className={'channelItem'}>{channel}</div>
                                <div className={'manageChannel'}>x</div>
                                <div className={'manageChannel'}>+</div>
                            </div>)
                        })
                    }
                </div>
            </div>
            <div className={'generalSettingsDiv'}>
                <p className={"settingLabel"}>Bot prefix</p>
                <div className={"inputSettingWrapper"}>
                    <input className={'inputSettingText'} type="text" name="" id="" />
                    <div className={'manageChannel'}>@</div>
                </div>
            </div>
        </div>
        <div className={"settingsSection"}>
            <p className={"section"}>Advanced Setting</p>
        </div>
    </div>)
}

export default CreateBotSettings