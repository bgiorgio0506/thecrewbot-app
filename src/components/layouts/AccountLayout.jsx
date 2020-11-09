import React from 'react';
import PropTypes from 'prop-types';
//import
import CreateAccount from '../account';
import CreateMiscMenu from '../common/miscMenu';

const AccountLayOut = ({ children, },) => {
    return (
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
