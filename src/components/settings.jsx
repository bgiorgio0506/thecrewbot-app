// Import dependencies
import React from 'react'
import { ipcRenderer } from 'electron'
import store from 'electron-store'
import settings from 'electron-settings'
import getLang from '../js/langLib';


const CreateSettings = ()=>{
    return (<div class = "center-panel">
        <p>Sei in settings</p>
    </div>)
}

export default CreateSettings