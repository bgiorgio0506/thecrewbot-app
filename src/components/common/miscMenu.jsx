import React, { useState, } from 'react';
import { Link, } from 'react-router-dom';

//import schema
import UISchema from '../../schema/headers.config';


const CreateMiscMenu = () => {
    const [miscActiveLink, setActiveLink,] = useState(11,);
    function handleMiscClick(id,) {
        setActiveLink(id,);
    }
    return (
        <div className={'misc-section'}>
            <div className={'misc-menu'}>
                {
                    UISchema.UISchemaState.miscMenu.map((menuItem,) => {
                        return (<Link id={menuItem.id} key={menuItem.id} to={menuItem.redirect} className={(menuItem.id === miscActiveLink) ? 'miscActive ' + menuItem.class : menuItem.class} onClick={() => { handleMiscClick(menuItem.id,); }}>{menuItem.title}</Link>);
                    },)
                }
            </div>
        </div>);
};

export default CreateMiscMenu;
