import React, { useEffect, useState } from 'react'; 
import {ipcRenderer} from 'electron'

const CreateToolbar = ()=>{
    const [simConnectState, setSimConnectState] = useState(false);
    const [isStreaming, setStreamingState]= useState(false);

    ipcRenderer.on('simconnect-connection-success', ()=>{
        console.log('Setting to true')
        setSimConnectState(true)
    })

    ipcRenderer.on('simconnect-error', (e , err)=>{
        console.log('Setting to true')
        setSimConnectState(false) // will display error one way or another
    })
 
    return(<div className= {'toolBar'}>
        <p className={'toolBarLabel'}> SimConnect status: {(simConnectState === false)? 'Awaiting Connection to sim' : 'Connected'}  | </p>
        <p id={'onAirLabel'}className={(isStreaming)? 'onAirLabel': 'offLineLabel'}> </p>
        <label htmlFor="onAirLabel"><p className={'toolBarLabel'}>{(isStreaming === true)? 'On Air':'Offline'}</p></label>
    </div>)
}

export default CreateToolbar