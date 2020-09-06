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
                html:false
            },
            {
                title: 'Questions',
                redirect: '#', 
                class:'', 
                html:false
            },
            {
                title: 'Custom Commands',
                redirect: '#', 
                class:'', 
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
                        html:false
                    },
                    {
                        title: 'Bot Settings',
                        redirect: '#', 
                        class:'', 
                        html:false
                    },
                    {
                        title: 'Key Bindings',
                        redirect: '#', 
                        class:'', 
                        html:false
                    }
                ],
                class: '',
                html: false
            }, 
            {
                title:"Stats", 
                redirect:"#",
                class: '',
                html: false
            },
            {
                title:"Commands", 
                redirect:"#",
                class: '',
                html: false
            }
        ]
    },
    CommandsState:[]
}

export default schema