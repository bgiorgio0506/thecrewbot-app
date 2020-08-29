//Import deps 
import React from 'react'
import { ipcRenderer , remote } from 'electron'
import schema from '../schema/headers.config'

const CreatHeader = () => {

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


    return (
        <div class="header">
            <a href={brand.redirect} class={brand.class}> {brand.title} </a>
            <div class="header-left">
            {
                    items.map((item) => {
                        if (item.html) return; //return(<li class ={item.class}><a href={item.redirect}> {item.title} </a></li>)
                        else return (<a href={item.redirect} >{item.title}</a>)
                    })
                }
            </div>
            <div class ="header-right">
                <i class="fas fa-times" onClick={()=>closeApp()}></i>
                <i class="far fa-window-maximize" onClick ={()=>toggleMinMax('max')}></i>
                <i class="fas fa-window-minimize" onClick={()=>toggleMinMax('min')}></i>
            </div>
        </div>
    )

}

export default CreatHeader