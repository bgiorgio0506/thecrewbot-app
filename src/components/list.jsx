// Import dependencies
import React from 'react';
import { ipcRenderer, } from 'electron';
import getLang from '../js/langLib';
/**
 * @todo Audio play;
 */
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
        //ipcRenderer.send('fetch-question-list',);//call the main to fetch list
        setState(questArr,);
    },);

    //Audio tbh;
    ipcRenderer.on('play-sound', (event, AudioPathFile,) => {
        console.log(AudioPathFile,);
        const audio = new Audio('C:\\Users\\Giorgiopc\\AppData\\Roaming\\AudioFiles\\ding.mp3',);
        audio.play();
    },);

    const handleClick = (id,) => {
        ipcRenderer.send('rm-quest', id,);
        setState(items.filter((item,) => item.id !== id,),);//change React state
    };

    if (items.length === 0) {
        return (<div className="center-panel">
            <div className={'flex-div'}>
                <p className='section'>{langObj.labels[0]}</p>
                <button style={{ margin : '10px 20px', padding : '5px 5px', }} onClick= {() => { ipcRenderer.send('fetch-question-list',); }} className= {'closeBtn'}>Refresh List</button>
            </div>
            <ul><p><strong>{langObj.labels[1]}</strong></p></ul>
        </div>);
    } else {
        return (
            <div className="center-panel">
                <div className={'flex-div'}>
                    <p className='section'>{langObj.labels[0]}</p>
                    <button style={{ margin : '10px 20px', padding : '5px 5px', }} onClick= {() => { ipcRenderer.send('fetch-question-list',); }} className= {'closeBtn'}>Refresh List</button>
                </div>
                <div style={{ height : '500px', overflowY : 'scroll', overflowX : 'hidden', }}>
                    <ul>
                        {items.map((item,) => {
                            return (
                                <li key={item.id} className="genericQuest" id={item.id}><strong>{item.user}</strong> in <strong>[{item.channel}]</strong> <p className="askPrefix">chiede</p>  :  {item.question} <input type="button" className="doneBtn" value="Done" onClick={() => handleClick(item.id,)} /> <br /></li>
                            );
                        },)}
                    </ul>
                </div>
            </div>
        );
    }

};

export default CreateList;
