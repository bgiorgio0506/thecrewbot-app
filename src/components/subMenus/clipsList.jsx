import React, { useEffect, useState } from 'react'; 
import twitchLib from'../../js/twitchLib' 
const TwitchApi = new twitchLib.TwitchApi();



const CreateClipsList = ()=>{
    let res = []; 
    const [lives, setLives] = useState(res);
    const [loading, setLoading] = useState(true)
     useEffect(()=>{
        TwitchApi.getTopClips().then((res)=>{
            res = JSON.parse(res)
            console.log(res.data)
            setLives(res.data)
            setLoading(false)
            
        })
     })
    if(loading === true){
        return(<p>loading ...</p>)
    }else
    return (<div className= {'clipsSection'}>
        { 
           lives.map((live)=>{
               return(
                   <div className= {'clipItem'}>
                       <img className={'clipImgItem'} src={live.thumbnail_url} alt=""/>
                       <p>Views: {live.view_count}</p>
                   </div>
               )
           })
        }
    </div>)
}
export default CreateClipsList