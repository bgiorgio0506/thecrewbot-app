// Import dependencies
import React, { useEffect, } from 'react';
import { ipcRenderer, } from 'electron';
import getLang from '../js/langLib';

// Create list component
const CreateList = () => {
    const langObj = getLang();
    let Inititems = [];
    const [items, setState,] = React.useState(Inititems,);

    //on main response
    ipcRenderer.on('list-response', (event , questArr,) => {
        setState(questArr,);
    },);

    ipcRenderer.on('add-quest', (event, questArr,) => {
        ipcRenderer.send('fetch-question-list',);//call the main to fetch list
        setState(questArr,);
    },);

    const handleClick = (id,) => {
        ipcRenderer.send('rm-quest', id,);
        setState(items.filter((item,) => item.id !== id,),);//change React state
    };

    if (items.length === 0) {
        return (<div className="center-panel">
            <p className='section'>{langObj.labels[0]}</p>
            <ul><p><strong>{langObj.labels[1]}</strong></p></ul>
        </div>);
    } else {
        return (
            <div className="center-panel">
                <p className='section'>{langObj.labels[0]}</p>
                <ul>
                    {items.map((item,) => {
                        return (
                            <li key={item.id} className="genericQuest" id={item.id}><strong>{item.user}</strong> in <strong>[{item.channel}]</strong> <p className="askPrefix">chiede</p>  :  {item.question} <input type="button" className="doneBtn" value="Done" onClick={() => handleClick(item.id,)} /> <br /></li>
                        );
                    },)}
                </ul>
            </div>
        );
    }

};

export default CreateList;
