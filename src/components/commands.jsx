import React from 'react';
import CommandSchema from '../schema/commandConfig';

const CreateCommand = () => {
    return (<div className = "center-panel">
        <p className= 'section'>Command Dashboard</p>
        <ul>
            {
                CommandSchema.configData.commands.map((cmd,) => {
                    return (<p key={cmd.commandString}>{JSON.stringify(cmd,)}</p>);
                },)
            }
        </ul>
    </div>);
};

export default CreateCommand;
