/**Import deps */
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/app.css';

//import settings Schema
import schema  from '../../schema/settings.config';
import permissionSchema from '../../schema/permissionConfig';

const CreateOptsModal = ({ handleClose, show, commadConfig, },) => {
    console.log(commadConfig, schema.UISchemaState.commandsSettings,);
    const showHideClassName = show ? 'modal display-block' : ' modal display-none ';
    if (commadConfig.commandString === undefined)
        return <div className={showHideClassName}>
            <div className="modal-main" >
                <div className={'modalMessage'}>No command Informations received</div>
                <button onClick={handleClose} className = {'closeBtn'}>Ok</button>
            </div>
        </div>;
    else return <div className={showHideClassName}>
        <div className="modal-main" style={{ width : '800px' , height : '600px', }}>
            <div className = "settingsSection">
                <p className = 'section'> General Setting</p>
                {
                    schema.UISchemaState.commandsSettings.generalSettings.map((setting,) => {
                        return <div key = {setting.id}>
                            <label htmlFor = {setting.id}>{setting.labelText}</label>
                            <input type={setting.inputType}/>
                        </div>;
                    },)
                }
                <p className= 'section'>Permissions</p>
                <select id='permission' name= 'permission' value={permissionSchema[0].schema}>
                    {
                        //value and id are the same
                        permissionSchema.map((permObj,) => {
                            return <option key = {permObj.id} value={permObj.id}>{permObj.label}</option>;
                        },)
                    }
                </select>
            </div>
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
