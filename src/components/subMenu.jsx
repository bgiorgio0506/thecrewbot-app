/*Import dependencies*/
import React from 'react'
import {Link} from 'react-router-dom';
import UISchema from '../schema/headers.config';
import {ipcRenderer} from 'electron';
import getLang from '../js/langLib';
import utils from '../helpers/utility'


/**
 * 
 * @param {String} route route of the componet
 */
async function getSubMenus(route){
    return new Promise((resolve, reject)=>{
        try {
            if(route === '/' && UISchema.UISchemaState.logoObj.subMenus !== undefined){
                return resolve(UISchema.UISchemaState.logoObj.subMenus)
            }else{
                let headerMenuObjs = UISchema.UISchemaState.headerObjs
                headerMenuObjs.map((headerObj)=>{
                    if(route.includes(headerObj.redirect) && utils.isEmpty(headerObj.subMenus) ===false) return resolve(headerObj.subMenus);
                    else resolve()
                })
            }
        } catch (err) {
            return reject(err)
        }
    })
}


//crete sub menu
const CreateSubMenu = async(route)=>{
    //get route sub menus and lang
    let subMenu = await getSubMenus(route).catch(err=>{throw err});
    let langObj = getLang()

    //if no sub menu nothing to render
    if(subMenu === ' ' || subMenu === undefined) return;
    //render subMenus
    else return(<div>

    </div>)
}

export default CreateSubMenu