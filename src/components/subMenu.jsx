/*Import dependencies*/
import React from 'react'
import {Link, useLocation, withRouter} from 'react-router-dom';
import UISchema from '../schema/headers.config';
import {ipcRenderer} from 'electron';
import getLang from '../js/langLib';
import utils from '../helpers/utility'


/**
 * 
 * @param {String} route route of the componet
 */
function getSubMenus(location) {
    if (location.pathname.includes('/') === true  && location.pathname.length === 1 && UISchema.UISchemaState.logoObj.subMenus !== undefined) return UISchema.UISchemaState.logoObj.subMenus
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

    //let langObj = getLang()

    if (utils.isEmpty(subMenu) === true) return (<div className={"suvMenuSection"}></div>);
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