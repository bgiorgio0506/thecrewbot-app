/**Import Componets*/
import { ipcRenderer, } from 'electron';
import React, { Component, } from 'react';
import twitchLib from '../js/twitchLib';
import CreateModals from './common/modal';
import utils  from '../helpers/utility';
import path from 'path';
const twitchClient = new twitchLib.OAuth2Provider();
const TwitchApi = new twitchLib.TwitchApi();

//import components
import CreateLoading from '../components/common/loading';

//import schema

class CreateAccount extends Component {
    constructor(props,) {
        super(props,);
        this.state = {
            data      : [],
            follow    : 0,
            subs      : 0,
            isLoading : false,
            error     : null,
            showModal : false,
        };
    }

    componentDidMount() {
        /*eslint-disable promise/no-nesting*/
        twitchClient.getOAuth2Data().then((profile,) => {
            this.setState({ isLoading : true, },);

            //async operation set finish loading only on last ops
            if (profile !== null) {
                TwitchApi.getUser().then((UserProfile,) => {
                    UserProfile = JSON.parse(UserProfile,);
                    return this.setState({ isLoading : false, error : null, data : UserProfile.data, },);
                },).catch((err,) => {
                    console.info(err,);
                    return this.setState({ isLoading : false, error : { message : 'Error downloading data.', code : 403, }, data : null, showModal : true, },);
                },);

                TwitchApi.getUserFollows().then((follows,) => {
                    follows = JSON.parse(follows,);
                    return this.setState({ isLoading : false, error : null, follow : follows.total, },);
                },).catch((err,) => {
                    console.info(err,);
                    return this.setState({ isLoading : false, error : { message : 'Error downloading data.', code : 500, }, data : null, showModal : true, },);
                },);

                TwitchApi.getUserSubs().then((subs,) => {
                    subs = JSON.parse(subs,);
                    console.log(subs,);
                    if (subs.data !== undefined) subs = parseInt(subs.data.length,);
                    else subs = 0;
                    return this.setState({ isLoading : false, error : null, subs : subs, },);
                },).catch((err,) => {
                    console.info(err,);
                    return this.setState({ isLoading : false, error : { message : 'Error downloading data.', code : 500, }, data : null, showModal : true, },);
                },);
            }
            else {
                return this.setState({ isLoading : false, error : { message : 'Error downloading data. Please check you have connected your account correctly.', code : 403, }, data : null, showModal : true, },);
            }

            ipcRenderer.on('webhook.notification', (e, notification,) => {
                //switch
                console.log(notification,);
                switch (notification.type) {
                case 'notification.profile':
                    this.setState({ data : notification.data, },);
                    break;
                case 'notification.subs':
                    //get the last notification and add to
                    var actualSub = this.state.subs;
                    actualSub += 1;
                    this.setState({ subs : actualSub, },);
                    break;
                case 'notification.follow':
                    var actualFollow = this.state.follow;
                    actualFollow += 1;
                    this.setState({ follow : actualFollow, },);
                    break;
                default:
                    console.log('Got wierd notification with unspecifided type',);
                }
            },);
            return;
        },).catch((err,) => {
            throw err;
        },);
    }

    render() {
        const { isLoading, error, data, follow, subs, } = this.state;

        console.error(error,);
        if (error && error.code !== 403) {
            return (
                <div className="center-panel">
                    <div className={'center-account-panel'}>
                        <CreateModals show={this.state.showModal} handleClose={() => this.setState({ showModal : false, },)}>
                            <p className={'modalTitle'}>Error</p>
                            <div className={'modalMessage'}>{error.message}</div>
                        </CreateModals>
                        <strong>Error loading profile data</strong>
                    </div>
                </div>);
        }
        else if (error && error.code === 403) {
            return (<div className="center-panel">
                <div className={'center-account-panel'}>
                    <CreateModals show={this.state.showModal} handleClose={() => {
                        twitchClient.startOAuth2Strategy().then((res,) => {
                            if (typeof res !== 'object') {
                                return utils.writeFile('OAuth.html', res,).then(() => {
                                    this.setState({ showModal : false, },);
                                    return ipcRenderer.send('open-auth', { path : path.join(process.env.APPDATA, 'thecrewbot-app\\Temp%20Folder\\',), fileName : 'OAuth.html', },);
                                },).catch((err,) => {
                                    throw err;
                                },);
                            } else return this.setState({ isLoading : false, error : { message : 'Error while opening OAuth  Flow.', code : 500, }, data : null, showModal : true, },);
                        },).catch((err,) => {
                            console.log(err,);
                            return this.setState({ isLoading : false, error : { message : 'Error while connecting to twitch server.', code : 404, }, data : null, showModal : true, },);
                        },);
                    }}>
                        <p className={'modalTitle'}>Action Required</p>
                        <div className={'modalMessage'}>Please link your account to twitch for the appliacation to work. </div>
                    </CreateModals>
                    <strong>Error loading profile data</strong>
                </div>
            </div>);
        }

        if (isLoading) {
            return (
                <div className={'center-panel'}>
                    <div className={'center-account-panel'}>
                        <CreateLoading />
                    </div>
                </div>);
        }

        return (<div className={'AccountSection'}>
            {
                data.map((item,) => {
                    return (
                        <div key={item.login} className={'AccountSection'}>
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
                        </div>);
                },)
            }
        </div>);
    }
}

export default CreateAccount;
