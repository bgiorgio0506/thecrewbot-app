import React, { Fragment, } from 'react';

const schema = {
    UISchemaState : {
        logoObj : {
            title : (<Fragment>
                <strong>THE</strong>CREWBOT
            </Fragment>), //if logo can be writed
            class    : 'logo', //css class
            redirect : '/account', //tbd
            isImg    : false, //for the future
            ImgSrc   : '',// case the logo is img
            imgStyle : {}, // reactStyle props for img
            onclick  : () => { return; },//function
            //submenus
            subMenus : [{
                title    : 'Account',
                redirect : '/account',
                class    : '',
                id       : 1,
                html     : false,
            },
            {
                title    : 'Questions',
                redirect : '/questions',
                class    : '',
                id       : 2,
                html     : false,
            },
            {
                title    : 'Pool answers',
                redirect : '#',
                class    : '',
                id       : 3,
                html     : false,
            },
            ],
        },
        headerObjs : [
            {
                title    : 'Settings',
                redirect : '/settings',
                subMenus : [
                    {
                        title    : 'General',
                        redirect : '/settings',
                        class    : '',
                        id       : 1,
                        html     : false,
                    },
                    {
                        title    : 'Bot Settings',
                        redirect : '/settings/bot',
                        class    : '',
                        id       : 2,
                        html     : false,
                    },
                    {
                        title    : 'Key Bindings',
                        redirect : '#',
                        class    : '',
                        id       : 3,
                        html     : false,
                    },
                    {
                        title    : 'Stream Deck Bindings',
                        redirect : '/settings/streamdeck',
                        class    : '',
                        id       : 4,
                        html     : false,
                    },
                ],
                class : '',
                id    : 1,
                html  : false,
            },
            {
                title    : 'Stats',
                redirect : '#',
                class    : '',
                id       : 2,
                html     : false,
            },
            {
                title    : 'Commands Panel',
                redirect : '/commands',
                class    : '',
                id       : 3,
                subMenus : [
                    {
                        title    : 'Custom Commands',
                        redirect : '#',
                        class    : '',
                        id       : 1,
                        html     : false,
                    },
                    {
                        title    : 'Permissions Control',
                        redirect : '#',
                        class    : '',
                        id       : 2,
                        html     : false,
                    },
                ],
                html : false,
            },
        ],
        miscMenu : [
            {
                title    : 'Lives',
                redirect : '/account/lives',
                class    : 'miscHeaderItem',
                id       : 11,
                html     : false,
            },
            {
                title    : 'Clips',
                redirect : '/account/clips',
                class    : 'miscHeaderItem',
                id       : 21,
                html     : false,
            },
            {
                title    : 'Videos',
                redirect : '/account/video',
                class    : 'miscHeaderItem',
                id       : 31,
                html     : false,
            },
        ],
        activeLink           : 2,
        isUpdaterDownloading : false, //used from the mainProcess to regulate UI state

    },
};

export default schema;
