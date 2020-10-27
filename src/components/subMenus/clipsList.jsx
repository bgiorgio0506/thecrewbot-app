import React from 'react'; 
import twitchLib from'../../js/twitchLib' 
const TwitchApi = new twitchLib.TwitchApi();



const CreateClipsList = ()=>{
    //let res = []; 
    //const [lives, setLives] = useState(res);
    TwitchApi.getTopClips().then((res)=>{
        console.log(res)
        //setLives(res)
    })
    return (<p>Hey</p>)
}
export default CreateClipsList