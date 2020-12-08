//Import deps
import React from 'react';
import { Link, } from 'react-router-dom';
import { ipcRenderer , remote, } from 'electron';
import UIschema from '../schema/headers.config';

const CreatHeader = () => {

    //Get schema for header and brand
    let items = UIschema.UISchemaState.headerObjs;
    let brand = UIschema.UISchemaState.logoObj;

    //updaterUI state
    const [updatesState, setState,] = React.useState(UIschema.UISchemaState.isUpdaterDownloading,);
    const [errorUpdateCheck, setErrorState,] = React.useState(false,); //updater error states

    //close app
    const closeApp = () => {
        ipcRenderer.send('quit-app',);
    };

    //Receiving any Updaterstate from main process
    ipcRenderer.on('updateState', (e , state,) => {
        if (typeof state === 'object') {
            if (updatesState === true )setState(false,); //setUpdater State to flase
            setErrorState(true,);//set error state
        } else {
            if (errorUpdateCheck ===true) setErrorState(false,); //set error state
            setState(state,);
        }
    },);

    //Minimize or maximize
    const toggleMinMax = (ops,) => {
        switch (ops) {
        case 'max':
            remote.getCurrentWindow().maximize();
            break;

        case 'min':
            remote.getCurrentWindow().minimize();
            break;
        default:
            remote.dialog.showErrorBox('Unexpected Error', 'An error popped up',);
            break;
        }
    };


    //renturn to render
    return (
        <div className="header">
            <Link to={brand.redirect} className={brand.class}> {brand.title} </Link>
            <div className="header-left">
                {
                    items.map((item,) => {
                        if (item.html) return; //return(<li class ={item.class}><a href={item.redirect}> {item.title} </a></li>)
                        else return (<Link to={item.redirect}  className = {item.class}>{item.title}</Link>);
                    },)
                }
            </div>
            <div className ="header-right">
                <i id="updaterIcon" className={(updatesState === true) ? 'fas fa-sync-alt updaterAnimation' :(errorUpdateCheck === true) ? 'fas fa-exclamation-circle' : ' '}></i>
                <i className="fas fa-window-minimize" onClick={() => toggleMinMax('min',)}></i>
                <i className="far fa-window-maximize" onClick ={() => toggleMinMax('max',)}></i>
                <i className="fas fa-times" onClick={() => closeApp()}></i>
            </div>
        </div>
    );
};

export default CreatHeader;
