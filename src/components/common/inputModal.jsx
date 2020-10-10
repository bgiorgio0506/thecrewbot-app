/**Import deps **/
import React from 'react';
import '../../assets/css/app.css';

const CreateInputModals = ({ handleAdd, handleCancel, show, children }) => {
    const showHideClassName = show ? "modal display-block" : " modal display-none";
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
    </div>)
}

export default CreateInputModals;
