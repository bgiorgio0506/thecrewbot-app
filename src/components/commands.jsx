import React, { useState, } from 'react';
import settings from 'electron-settings';
import { ipcRenderer, } from 'electron';
import utils from '../helpers/utility';
//Schemas
import permissionSchema from '../schema/permissionConfig';

//componets
import CreateModals from '../components/common/modal';
import CreateOptsModal from './common/commandOptions';


/**
 * @todo use event for catching settings changes from outside
 * 1. when adding commands change also initConfig just in case;
*/

const CreateCommand = () => {
    let initConfig = settings.getSync('config.commadConfig',);
    const [CommandConfig, setCommandConfig,]  = useState(initConfig,);
    const [showModal, setShowModal,] = useState(false,);
    const [currentCommand, setCurrentCommand,] = useState('',);
    const [showOptsModal , setOptsModal,] = useState(false,);

    function getPermissionsLabel (perm,) {
        let index = permissionSchema.indexOf(perm,);
        if (index !== -1) return permissionSchema[index].label;
        else return 'All';
    }

    function getCurrentCommandObj (){
        if (currentCommand !== undefined){
            let index = utils.findIndexInObjArr(CommandConfig.commands, 'commandString', currentCommand,);
            if (index != -1) return CommandConfig.commands[index];
            else return {};
        } else return {};
    }

    function hideModal(event,){
        let target = event.target;
        if (target.value === 'No')
            setShowModal(false,);
        else {
            console.log(currentCommand,);
            let commandIndex = utils.findIndexInObjArr(initConfig.commands, 'commandString',currentCommand,);
            console.log(commandIndex,);

            //update UI
            let currentState = CommandConfig.commands;
            delete currentState[commandIndex];
            console.table(currentState,);
            setCommandConfig({ version : settings.getSync('config.commadConfig.version',), commands : currentState, },);

            // modify file only from the bot lib
            ipcRenderer.send('remove-command', commandIndex,);

            setShowModal(false,);
        }
    }

    function hideOptionsModal(event, ){
        let target = event.target;
        setOptsModal(false,);
    }

    //ipcRenderer event loop
    ipcRenderer.on('command-setting-changed',() => {
        setCommandConfig(settings.getSync('config.commadConfig',),);
        console.log('here',);
    },);


    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <div className = 'commandGrid'>
            <div>
                <p>Command</p>
            </div>
            <div>
                <p>Permissions</p>
            </div>
            <div>
                <p>Status</p>
            </div>
        </div>
        <div className="commandWrapper">
            {
                CommandConfig.commands.map((cmd,) => {
                    return (<div className= {'commandItem'} key={cmd.commandString}>
                        <div>
                            <p className= {'commandString-Label'}>{cmd.commandString}</p>
                        </div>
                        <div>
                            <p className= {'commandString-Label'}>{getPermissionsLabel(cmd.permissions,)}</p>
                        </div>
                        <div>
                            <p className= {(cmd.isCommandActive === true)?'commandString-status activeCmd' : 'commandString-status'} onClick={() => { console.log('clicked',); }}>{(cmd.isCommandActive === true) ? 'Active' : 'Disabled'}</p>
                        </div>
                        <div>
                            <i className="fas fa-trash-alt" style={{ fontSize : '15px', }} onClick={() => { setCurrentCommand(cmd.commandString,); setShowModal(true,); }}></i>
                            <i className="fas fa-cog" style={{ fontSize : '15px', }} onClick={() => { setCurrentCommand(cmd.commandString,);  setOptsModal(true,); }}></i>
                        </div>
                    </div>);
                },)
            }
        </div>
        <div className={'controls'}>
            <div className ={'addCommand'} onClick={() => { console.log('clicked',); } }>
                <p className={'addButton'}>+</p>
            </div>
        </div>
        <CreateModals handleClose={hideModal} show={showModal} yesNoQuest={true}>
            <p className={'modalTitle'}> Action Required</p>
            <div className={'modalMessage'}>Would you like to delete the command: <strong>{currentCommand}</strong></div>
        </CreateModals>
        <CreateOptsModal handleClose={hideOptionsModal} show={showOptsModal} commadConfig = { getCurrentCommandObj()} />
    </div>);
};

export default CreateCommand;


