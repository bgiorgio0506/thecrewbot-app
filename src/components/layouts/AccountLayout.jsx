import React, { useState, } from 'react';
import { ipcRenderer, } from 'electron';
import PropTypes from 'prop-types';
import log from 'electron-log';
//import
import CreateAccount from '../account';
import CreateMiscMenu from '../common/miscMenu';

const AccountLayOut = ({ children, },) => {
    const [isUpdating, setUpdating,] = useState(false,);
    const [statusLabel, setLabel,] = useState('Processing...',);
    const [progressStatus, setProgress,] = useState(0,);

    ipcRenderer.on('updateState', (e, statUpdate,) => {
        log.info(statUpdate,);
        setUpdating(statUpdate.status,);
        setLabel(statUpdate.message,);
        setProgress(statUpdate.percentage,);
    },);
    if (isUpdating) {
        return (<div className={'updateOverLay'}>
            <div className={'updaterWrapper'}>
                <p className={'progressBarLabel'}>{statusLabel}</p>
                <div className={'loadingBarTrack'}>
                    <div className = {'loadingBar'} style={{ width : progressStatus.toString()+'%', }}></div>
                </div>
            </div>
        </div>);
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
