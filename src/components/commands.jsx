import React from 'react';
//Schemas
import CommandSchema from '../schema/commandConfig';
import permissionSchema from '../schema/permissionConfig';


const CreateCommand = () => {

    function getPermissionsLabel (perm,) {
        let index = permissionSchema.indexOf(perm,);
        if (index !== -1) return permissionSchema[index].label;
        else return 'All';
    }

    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <div className={'commandWrapper'}>
            {
                CommandSchema.configData.commands.map((cmd,) => {
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
