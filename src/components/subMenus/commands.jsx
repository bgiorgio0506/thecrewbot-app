import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import CommandSchema from '../../schema/commandConfig'

const CreateCommand = ()=>{
    return(<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <ul>
        {
            CommandSchema.configData.commands.map((cmd)=>{
                return(JSON.stringify(cmd));
            })
        }
        </ul>
    </div>)
}

export default CreateCommand