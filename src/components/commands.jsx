import React, { useState, } from 'react';
import settings from 'electron-settings';
//Schemas
import permissionSchema from '../schema/permissionConfig';
import commandSchema  from '../schema/commandConfig';


/**@todo use event for catching settings changes from outside */

const CreateCommand = () => {
    const [CommandConfig, setCommandConfig,]  = useState(commandSchema.configData,);

    function getPermissionsLabel (perm,) {
        let index = permissionSchema.indexOf(perm,);
        if (index !== -1) return permissionSchema[index].label;
        else return 'All';
    }

    //setInterval( () => {
    //    console.log('here',);
    //    setCommandConfig(settings.getSync('config.commadConfig',),);
    //}, 8000,);

    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <div className={'commandWrapper'}>
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
