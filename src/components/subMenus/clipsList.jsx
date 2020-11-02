import React, { useEffect, useState } from 'react';
import twitchLib from '../../js/twitchLib'
const TwitchApi = new twitchLib.TwitchApi();



const CreateClipsList = () => {
    let res = [];
    let thumb = [];
    const [lives, setLives] = useState(res);
    const [loading, setLoading] = useState(true)
    const [thumbnails, setThumnails] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSlideStyle, setCurrentSlideStyle] = useState({});
    const [nextSlideStyle, setNextSlideStyle] = useState({});
    const [previousSlideStyle, setPreviousSlideStyle] = useState({});


    useEffect(() => {
        TwitchApi.getTopClips().then((res) => {
            res = JSON.parse(res)

            if(res.data !== undefined) res.data.map((live) => {
                thumb.push(live.thumbnail_url);
            })
            console.log(res.data)
            setLives(res.data)
            setThumnails(thumb);
            setCurrentSlideStyle({
                backgroundImage: "url('" + thumb[currentSlide] + "')"
            });

            if(currentSlide>0){
                setPreviousSlideStyle({
                    background: "url('"+thumb[currentSlide-1]+"')"
                });
            }else{
                setPreviousSlideStyle({
                    background: "url('"+thumb[thumb.length-1]+"')"
                });
            }

            if(currentSlide === thumb.length-1){
                setNextSlideStyle({
                    background: "url('"+thumb[0]+"')"
                });
            }else{
                setNextSlideStyle({
                    background: "url('"+thumb[currentSlide+1]+"')"
                });
            } 

            setLoading(false)

        })
    }, [currentSlide])

    function previous() {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        } else {
            setCurrentSlide(lives.length - 1);
        }
    }

    function next() {
        if (currentSlide === lives.length-1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    }

    if (loading === true) {
        return (<p>loading ...</p>)
    } else
    console.log(currentSlide)
        return (<div className={'clipsSection'}>
            <section className="slideshow">
                <div className="slide-holder">
                <span  className={'slideShowController slidePrevious'} onClick={previous}><i class="fas fa-caret-left fa-5x"></i></span>
                    <section className="slide previous-slide">
                        <div style={previousSlideStyle} className="slide-thumbnail overlay"></div>
                    </section>
                    <section className="slide current-slide">
                        <div style={currentSlideStyle} className="slide-thumbnail"></div>
                        <p className= {'clipStatLabel'}><i class="fas fa-eye"></i>{lives[currentSlide].view_count}</p>
                    </section>
                    <section className="slide next-slide">
                        <div style={nextSlideStyle} className="slide-thumbnail overlay"></div>
                    </section>
                    <span  className={'slideShowController slideStart'} onClick={next}><i class="fas fa-caret-right fa-5x"></i></span>
                </div>
            </section>
        </div>)
}
export default CreateClipsList


/**
 *  {
           lives.map((live)=>{
               return(
                   <div className= {'clipItem'}>
                       <img className={'clipImgItem'} src={live.thumbnail_url} alt=""/>
                       <p className= {'clipStatLabel'}><i class="fas fa-eye"></i>{live.view_count}</p>
                   </div>
               )
           })
        }
 */

 /**
  * <div className="slideshow-controller">
                    <span onClick={previous}>Previous</span>
                    <span onClick={next}>Next</span>
                </div>
  */