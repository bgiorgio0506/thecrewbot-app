//Import deps 
import React from 'react'
import {Link} from 'react-router-dom'
import { ipcRenderer , remote } from 'electron'
import schema from '../schema/headers.config'

const CreatHeader = () => {

    //Get schema for header and brand
    let items = schema.UISchemaState.headerObjs;
    let brand = schema.UISchemaState.logoObj;

      //close app
      const closeApp = ()=>{
        ipcRenderer.send('quit-app')
    };

    //Minimize or maximize
    const toggleMinMax = ops => {
        switch (ops) {
            case 'max':
                remote.getCurrentWindow().maximize()
                break;
        
            case 'min':
                remote.getCurrentWindow().minimize()
                break;
            default:
                remote.dialog.showErrorBox('Unexpected Error', 'An error popped up')
                break;
        }
      };


    //renturn to render
    return (
        <div class="header">
            <Link to={brand.redirect} className={brand.class}> {brand.title} </Link>
            <div class="header-left">
            {
                    items.map((item) => {
                        if (item.html) return; //return(<li class ={item.class}><a href={item.redirect}> {item.title} </a></li>)
                        else return (<Link to={item.redirect} >{item.title}</Link>)
                    })
                }
            </div>
            <div class ="header-right">
                <i class="fas fa-window-minimize" onClick={()=>toggleMinMax('min')}></i>
                <i class="far fa-window-maximize" onClick ={()=>toggleMinMax('max')}></i>
                <i class="fas fa-times" onClick={()=>closeApp()}></i>
            </div>
        </div>
    )

}

export default CreatHeader