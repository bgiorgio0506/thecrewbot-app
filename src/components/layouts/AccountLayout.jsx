import React from 'react'

//import 
import CreateAccount from '../account'
import CreateMiscMenu from '../common/miscMenu'

const AccountLayOut = ({ children }) => {
    return (
        <div className={'center-panel'}>
            <div className={'center-account-panel'}>
                <CreateAccount />
                <CreateMiscMenu />
                {children}
            </div>
        </div>)
}

export default AccountLayOut