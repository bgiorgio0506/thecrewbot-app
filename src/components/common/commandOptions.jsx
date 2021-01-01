/**Import deps */
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';

const CreateOptsModal = ({ handleClose, show, commadConfig, },) => {
    console.log(commadConfig,);
    const showHideClassName = show ? 'modal display-block' : ' modal display-none ';
    if (commadConfig.commandString === undefined)
        return <div className={showHideClassName}>
            <div className="modal-main">
                <div className={'modalMessage'}>No command Informations received</div>
                <button onClick={handleClose} className = {'closeBtn'}>Ok</button>
            </div>
        </div>;
    else return <div className={showHideClassName}>
        <div className="modal-main">
            options
            <div className={'display-flex'}>
                <button onClick={handleClose} value={'Save'} style={{ margin : '22px 5px', background : 'green', }} className = {'closeBtn'}>Save</button>
                <button onClick={handleClose} value={'Cancel'} style={{ margin : '22px 5px', background : 'red', }} className = {'closeBtn'}>Cancel</button>
            </div>
        </div>
    </div>;
};

CreateOptsModal.PropTypes = {
    handleClose  : PropTypes.func.isRequired,
    show         : PropTypes.bool.isRequired,
    commadConfig : PropTypes.object.isRequired,
};

export default CreateOptsModal;
