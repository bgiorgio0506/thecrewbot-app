import React, {Fragment} from 'react'

const schema = {
    UISchemaState: {
        logoObj:{
            title:(<Fragment>
                <strong>THE</strong>CREWBOT
            </Fragment>), //if logo can be writed
            class:'logo', //css class
            redirect:'/', //tbd
            isImg: false, //for the future
            ImgSrc : '',// case the logo is img
            imgStyle:{}, // reactStyle props for img
            onclick: ()=>{return;},//function
            //submenus
            subMenus:[{
                title: 'Account',
                redirect: '#', 
                class:'',
                id:1,
                html:false
            },
            {
                title: 'Questions',
                redirect: '#', 
                class:'',
                id:2, 
                html:false
            },
            {
                title: 'Custom Commands',
                redirect: '#', 
                class:'', 
                id:3,
                html:false
            },
        ]
        },
        headerObjs:[
            {
                title:"Settings", 
                redirect:"/settings",
                subMenus: [
                    {
                        title: 'General',
                        redirect: '#', 
                        class:'', 
                        id:1,
                        html:false
                    },
                    {
                        title: 'Bot Settings',
                        redirect: '#', 
                        class:'', 
                        id:2,
                        html:false
                    },
                    {
                        title: 'Key Bindings',
                        redirect: '#', 
                        class:'', 
                        id:3,
                        html:false
                    }
                ],
                class: '',
                id:1,
                html: false
            }, 
            {
                title:"Stats", 
                redirect:"#",
                class: '',
                id:2,
                html: false
            },
            {
                title:"Commands", 
                redirect:"#",
                class: '',
                id:3,
                html: false
            }
        ], 
        activeLink: null, 
        isUpdaterDownloading:false //used from the mainProcess to regulate UI state

    },
    CommandsState:[]
}

export default schema