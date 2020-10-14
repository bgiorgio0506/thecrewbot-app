/**Import Componets*/
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import utils from '../helpers/utility'
import twitchLib from '../js/twitchLib'
import CreateModals from './common/modal';
const twitchClient = new twitchLib.OAuth2Provider();
const TwitchApi = new twitchLib.TwitchApi()

class CreateAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            follow: 0,
            subs: 0,
            isLoading: false,
            error: null,
            showModal: false
        };
    }

    componentDidMount() {

        twitchClient.getOAuth2Data().then((profile) => {
            this.setState({ isLoading: true });

            if (profile !== null) {
                TwitchApi.getUserFollows().then((follows) => {
                    follows = JSON.parse(follows);
                    TwitchApi.getUserSubs().then((subs) => {
                        subs = JSON.parse(subs)
                        if (subs.data !== undefined) subs = parseInt(subs.data.length);
                        else subs = 0;
                        this.setState({ isLoading: false, error: null, data: profile.data, follow: follows.total, subs: subs })
                    }).catch((err) => {
                        console.info(err)
                        this.setState({ isLoading: false, error: { message: 'Error downloading data.' }, data: null, showModal: true })
                    })
                }).catch((err) => {
                    console.info(err)
                    this.setState({ isLoading: false, error: { message: 'Error downloading data.' }, data: null, showModal: true })
                })
            }
            else {
                this.setState({ isLoading: false, error: { message: 'Error downloading data. Please check you have connected your account correctly.' }, data: null, showModal: true })
            }

            ipcRenderer.on('webhook.notification', (e, data) => {
                //switch
            })
        })
    }



    render() {
        const { isLoading, error, data, follow, subs } = this.state;
        if (error) {
            return (
                <div className="center-panel">
                    <div className={'center-account-panel'}>
                        <CreateModals show={this.state.showModal} handleClose={() => this.setState({ showModal: false })}>
                            <p className={'modalTitle'}>Error</p>
                            <div className={'modalMessage'}>{error.message}</div>
                        </CreateModals>
                        <strong>Error loading profile data</strong>
                    </div>
                </div>)
        }
        if (isLoading) {
            return (
                <div className={'center-panel'}>
                    <div className={'center-account-panel'}>
                        Loading ...
                    </div>
                </div>)
        }


        return (<div className={'center-panel'}>
            {
                data.map((item) => {
                    return (<div className={'center-account-panel'}>
                        <div className={'AccountSection'}>
                            <img className={'accountImage'} src={item.profile_image_url} />
                            <div className={'accountLabel'}>
                                <p className={'pAccountLabel'}>{item.login}</p>
                                <p className={'displayName'}>#{item.display_name}</p>
                            </div>
                            <div className={'accountStat'}>
                                <div className={'stat'}>
                                    <p id={'viewCount'} className={'statLabel'}>{item.view_count}</p>
                                    <label className={'statInd'} htmlFor="viewCount">Views</label>
                                </div>
                                <div className={'sepStat'}></div>
                                <div className={'stat'}>
                                    <p id={'followCount'} className={'statLabel'}>{follow}</p>
                                    <label className={'statInd'} htmlFor="followCount"> Follows</label>
                                </div>
                                <div className={'sepStat'}></div>
                                <div className={'stat'}>
                                    <p id={'statCount'} className={'statLabel'}>{subs}</p>
                                    <label className={'statInd'} htmlFor="statCount">Subs</label>
                                </div>
                            </div>
                        </div>
                    </div>)
                })
            }
        </div>)
    }
}

export default CreateAccount;