/**Import deps **/
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';

const CreateModals = ({ handleClose, show, yesNoQuest,children, },) => {
    const showHideClassName = show ? 'modal display-block' : ' modal display-none';
    if (yesNoQuest !== undefined) return (<div className={showHideClassName}>
        <section className="modal-main">
            {children}
            <div className={'display-flex'}>
                <button onClick={handleClose} value={'Yes'} style={{ margin : '22px 5px', }} className = {'closeBtn'}>Yes</button>
                <button onClick={handleClose} value={'No'} style={{ margin : '22px 5px', }} className = {'closeBtn'}>No</button>
            </div>
        </section>
    </div>);
    return (<div className={showHideClassName}>
        <section className="modal-main">
            {children}
            <button onClick={handleClose} className = {'closeBtn'}>Ok</button>
        </section>
    </div>);
};

CreateModals.propTypes = {
    handleClose : PropTypes.func.isRequired,
    show        : PropTypes.bool.isRequired,
    yesNoQuest  : PropTypes.bool,
    children    : PropTypes.elementType,
};

export default CreateModals;
