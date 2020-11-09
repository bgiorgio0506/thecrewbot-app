/**Import deps **/
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';

const CreateInputModals = ({ handleAdd, handleCancel, show, children, },) => {
    const showHideClassName = show ? 'modal display-block' : ' modal display-none';
    return (<div className={showHideClassName}>
        <section className="modal-main">
            <div>
                {children}
            </div>
            <div className={'inputModalHeader'}>
                <button onClick={handleAdd} className={'inputBtn'}>Add</button>
                <button onClick={handleCancel} className={'inputBtn'}>Cancel</button>
            </div>
        </section>
    </div>);
};

CreateInputModals.propTypes = {
    handleAdd    : PropTypes.func.isRequired,
    handleCancel : PropTypes.func.isRequired,
    show         : PropTypes.bool.isRequired,
    children     : PropTypes.elementType,
};

export default CreateInputModals;
