import React, { useState, } from 'react';
import settings from 'electron-settings';
import { ipcRenderer, } from 'electron';
//Schemas
import permissionSchema from '../schema/permissionConfig';


/**@todo use event for catching settings changes from outside */

const CreateCommand = () => {
    let initConfig = settings.getSync('config.commadConfig',);
    const [CommandConfig, setCommandConfig,]  = useState(initConfig,);

    function getPermissionsLabel (perm,) {
        let index = permissionSchema.indexOf(perm,);
        if (index !== -1) return permissionSchema[index].label;
        else return 'All';
    }

    //ipcRenderer event loop
    ipcRenderer.on('command-setting-changed',() => {
        setCommandConfig(settings.getSync('config.commadConfig',),);
        console.log('here',);
    },);

    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <div className="commandWrapper">
            {
                CommandConfig.commands.map((cmd,) => {
                    return (<div className= {'commandItem'} key={cmd.commandString}>
                        <p className= {'commandString-Label'}>Command: {cmd.commandString}</p>
                        <p className= {'commandString-type'}>Type : {cmd.commandType}</p>
                        <p className= {'commandString-Label'}>Permission: {getPermissionsLabel(cmd.permissions,)}</p>
                        <p className= {(cmd.isCommandActive === true)?'commandString-status activeCmd' : 'commandString-status'}>{(cmd.isCommandActive === true) ? 'Active' : 'Disabled'}</p>
                    </div>);
                },)
            }
        </div>
    </div>);
};

export default CreateCommand;


//{JSON.stringify(cmd,)}
