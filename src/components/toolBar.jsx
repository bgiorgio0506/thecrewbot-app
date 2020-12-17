import React, { useState, } from 'react';
import { ipcRenderer, } from 'electron';

const CreateToolbar = () => {
    const [botConnectState, setBotConnectState,] = useState(false,);
    const [isStreaming, setStreamingState,]= useState(false,);

    ipcRenderer.on('connected', () => {
        console.log('Setting to true',);
        setBotConnectState(true,);
    },);

    ipcRenderer.on('play-sound', (e, AudioPathFile,) => {
        console.log(AudioPathFile,);
        const audio = new Audio(require(AudioPathFile,),);
        audio.play();
    },);

    //if a stream is already started
    ipcRenderer.on('live-status', (e,status,) => {
        setStreamingState(status,);
    },);

    ipcRenderer.on('webhook.notification', (e ,notification,) => {
        console.log(notification.type,);
        if (notification.type.includes('notification.stream',) === true){
            console.log(notification.data,);
            if (isStreaming && notification.data.length === 0) setStreamingState(false,);
            else if (notification.data.length > 0 && isStreaming === false) setStreamingState(true,);
        }
    },);

    return (<div className= {'toolBar'}>
        <p className={'toolBarLabel'}> Bot status: {(botConnectState === false)? 'Awaiting Connection' : 'Connected'}  | </p>
        <p id={'onAirLabel'}className={(isStreaming)? 'onAirLabel': 'offLineLabel'}> </p>
        <label htmlFor="onAirLabel"><p className={'toolBarLabel'}>{(isStreaming === true)? 'On Air':'Offline'}</p></label>
    </div>);
};

export default CreateToolbar;
