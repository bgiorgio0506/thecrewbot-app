import React from 'react';
import CommandSchema from '../schema/commandConfig';

const CreateCommand = () => {
    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <div className={'commandWrapper'}>
            {
                CommandSchema.configData.commands.map((cmd,) => {
                    return (<div className= {'commandItem'} key={cmd.commandString}>{JSON.stringify(cmd,)}</div>);
                },)
            }
        </div>
    </div>);
};

export default CreateCommand;
