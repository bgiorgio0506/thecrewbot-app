/*Import dependencies*/
import React, { useEffect } from 'react'
import {Link, useLocation} from 'react-router-dom';
import UISchema from '../schema/headers.config';
import {ipcRenderer} from 'electron';
import getLang from '../js/langLib';
import utils from '../helpers/utility'


/**
 * 
 * @param {String} route route of the componet
 */
function getSubMenus(location) {
    if (location.pathname.includes('/account') === true  && location.pathname.length === 8 && UISchema.UISchemaState.logoObj.subMenus !== undefined) return UISchema.UISchemaState.logoObj.subMenus
    else if(location.pathname.includes('/account/') === true){
        return UISchema.UISchemaState.logoObj.subMenus
    }
    else if(location.pathname.split('/').length > 2){
        let parsedRoute  = location.pathname.split('/')
        let labelIndex= utils.findIndexInObjArr(UISchema.UISchemaState.headerObjs, 'redirect', '/'+parsedRoute[1]);
        if(labelIndex !== -1){
            if(UISchema.UISchemaState.headerObjs[labelIndex].subMenus !== undefined && utils.isEmpty(UISchema.UISchemaState.headerObjs[labelIndex].subMenus) === false) 
            return UISchema.UISchemaState.headerObjs[labelIndex].subMenus
        }
    }
    else if(location.pathname.split('/').length === 2 && utils.findIndexInObjArr(UISchema.UISchemaState.logoObj.subMenus, 'redirect', location.pathname) !== -1){
        return UISchema.UISchemaState.logoObj.subMenus;
    }
    else {
        let headerMenuObjs = UISchema.UISchemaState.headerObjs
        let labelIndex = utils.findIndexInObjArr(headerMenuObjs, 'redirect', location.pathname)
        if(labelIndex !== -1){
            let headerObj = headerMenuObjs[labelIndex];
            if(headerObj.subMenus !== undefined && utils.isEmpty(headerObj.subMenus) === false) return headerObj.subMenus
        }else return; 
    }
}

function handleClick(id){
    UISchema.UISchemaState.activeLink = id
}

//crete sub menu
const CreateSubMenu = () => {
    //use location to detect route change
    let location = useLocation();
    let subMenu = getSubMenus(location)
    const activeLink = UISchema.UISchemaState.activeLink;
    useEffect(()=>{
        let index = utils.findIndexInObjArr(UISchema.UISchemaState.headerObjs, 'redirect', location.pathname)
        if(index !== -1)
        UISchema.UISchemaState.activeLink = UISchema.UISchemaState.headerObjs[index].id ;
        else
        UISchema.UISchemaState.activeLink = 1
    })
    //let langObj = getLang()

    if (utils.isEmpty(subMenu) === true) return (<div className={"subMenuSection"}></div>);
    else return (<div className={"subMenuSection"}>
        {
            subMenu.map((label) => {
                return (<Link to={label.redirect} id={label.id} onClick={() => { handleClick(label.id) }} className={
                    label.class +
                    (label.id === activeLink ? " active" : "")
                }>{label.title}</Link>)
            })
        }
    </div>)
}

export default CreateSubMenu