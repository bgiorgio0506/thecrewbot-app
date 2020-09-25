/**Import deps **/
import React from 'react';
import '../../assets/css/app.css';

const CreateModals = ({handleClose, show, children})=>{
    const showHideClassName = show ? "modal display-block" : " modal display-none";
    return (<div className={showHideClassName}>
        <section className="modal-main">
            {children}
            <button onClick={handleClose} className = {'closeBtn'}>Ok</button>
        </section>
    </div>)
}


export default CreateModals
