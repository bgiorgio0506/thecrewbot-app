import React, { useState, } from 'react';
import { ipcRenderer, } from 'electron';
import PropTypes from 'prop-types';
//import
import CreateAccount from '../account';
import CreateMiscMenu from '../common/miscMenu';

const AccountLayOut = ({ children, },) => {
    const [isUpdating, setUpdating,] = useState(false,);

    ipcRenderer.on('updateState', (status,) => {
        setUpdating(status,);
    },);
    if (isUpdating) {
        return (<div>Updating</div>);
    } else return (
        <div className={'center-panel'}>
            <div className={'center-account-panel'}>
                <CreateAccount />
                <CreateMiscMenu />
                {children}
            </div>
        </div>);
};

AccountLayOut.propTypes = {
    children : PropTypes.elementType.isRequired,
};

export default AccountLayOut;
