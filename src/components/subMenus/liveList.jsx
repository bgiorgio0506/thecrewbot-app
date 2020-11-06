import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import twitchLib from '../../js/twitchLib';


//componets
import CreateLoading from '../common/loading';
import CreateModals from '../common/modal';


const TwitchApi = new twitchLib.TwitchApi();

const CreateLiveList = () => {

    let liveRes = [];
    const [liveInfos, setLiveInfo] = useState(liveRes);
    const [dataLength, setLength] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        TwitchApi.getVideos().then((res) => {
           


            let dataRes = JSON.parse(res);
            console.log(dataRes.data)
            setLength(dataRes.data.lenth)
            setLoading(false)
            setLiveInfo(dataRes.data)
        }).catch((err) => {
            setError({
                message:err
            })
            setShowModal(true)
        })
    }, [dataLength])

    function hideModal() {
        setShowModal(false)
    }

    if (loading) return (<CreateLoading />)
    else if (error.message !== undefined) return (<div className="center-panel">
        <div className={'center-account-panel'}>
            <CreateModals show={showModal} handleClose={hideModal}>
                <p className={'modalTitle'}>Error</p>
                <div className={'modalMessage'}>{error.message}</div>
            </CreateModals>
            <strong>Error loading profile data</strong>
        </div>
    </div>)
    else return (<div>
        {
            liveInfos.map((video)=>{
                return(JSON.stringify(video))
            })
        }
    </div>)
}
export default CreateLiveList