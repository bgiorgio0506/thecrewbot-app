const { http, https, } = require('follow-redirects',);
const store = require('electron-store',);
const TwitchConfig = require('../schema/twitchApi.config',);
const log = require('electron-log',);
const event = require('events',);
const eventEmitter = new event.EventEmitter();
const webHookServer = require('../controllers/WebHook/webHookServer',);
const { net, } = require('electron',);

exports.OAuth2Provider = class  OAuth2Provider{

    /**
     * @description class constructor
     */
    constructor(){
        //User twitch options
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions;
        this.secret  = process.env.TWITCH_OAUTH_SECRET;
    }

    /**
     * @description start Oauth2 flow
     */
    startOAuth2Strategy(){
        return new Promise((resolve, reject,) => {
            let options = {
                hostname     : 'localhost',
                port         : process.env.SERVER_APP_PORT,
                path         : '/',
                maxRedirexts : 20,
                method       : 'GET',
                protocol     : 'http:',
            };

            const req = net.request(options,);
            req.on('response', (res,) => {
                let chunks = [];
                res.on('data', (chunk,) => {
                    chunks.push(chunk,);
                },);

                res.on('error', (err,) => {
                    return reject(err,);
                },);

                res.on('end', () => {
                    let responseBody =  Buffer.concat(chunks,);
                    responseBody = responseBody.toString();
                    try {
                        let jsonBody = JSON.parse(responseBody,);
                        console.log(jsonBody,);
                        return resolve(jsonBody,);
                    } catch (error) {
                        return resolve(responseBody.toString(),);
                    }
                },);
            },);

            req.on('error', (err, ) => {
                return reject(err,);
            },);

            req.on('redirect', () => {
                req.followRedirect();
            },);

            req.end();
        },);
    }

    /**
     * @description returns OAuth2 profile data
     */
    getOAuth2Data(){
        return new Promise((resolve,) => {
            const OAuth2Store = new store({ name : 'data', encryptionKey : process.env.SESSION_SECRET, },);
            let OAuth2Data  = OAuth2Store.get('profile',);
            if (OAuth2Data === undefined ) return resolve(null,);
            else return resolve(OAuth2Data,);
        },);

    }

    /**
     * @desription refresh token
     */
    refreshOAuth2Token(){
        return new Promise((resolve, reject,) => {
            const OAuth2Store = new store({ name : 'data', encryptionKey : process.env.SESSION_SECRET, },);
            let OAuth2Data  = OAuth2Store.get('profile',);
            log.info(OAuth2Data,);
            if (OAuth2Data === undefined ) return resolve(null,);
            else {
                const options = {
                    hostname : 'id.twitch.tv',
                    path     : `/oauth2/token?grant_type=refresh_token&refresh_token=${OAuth2Data.refreshToken}&client_id=${this.options.clientID}&client_secret=${process.env.TWITCH_OAUTH_SECRET}&scope=${decodeURIComponent(this.options.scopes.join('+',),)}`,
                    method   : 'POST',
                    protocol : 'https:',
                };

                const req = net.request(options,);
                req.setHeader('Content-Type','application/x-www-form-urlencoded',);

                req.on('response', (res,) => {
                    console.log(res.statusCode,);
                    let data = [];
                    res.on('data', (dataChuck,) => {
                        data.push(dataChuck,);
                    },);

                    res.on('end', () => {
                        let parsedBody = JSON.parse(data.toString(),);
                        log.info(parsedBody,);
                        OAuth2Data.accessToken = parsedBody.access_token;
                        OAuth2Data.refreshToken = parsedBody.refresh_token;
                        OAuth2Data.expires_in = parsedBody.expires_in;
                        OAuth2Store.set({ profile : OAuth2Data, },);
                        return resolve(true,);
                    },);

                    res.on('error', (err,) => {
                        return reject(err,);
                    },);
                },);

                req.on('error', (err,) => {
                    throw err;
                },);

                req.on('redirect', () => {
                    req.followRedirect();
                },);

                req.end();
            }
        },);
    }

};

/**
 * @description a twitch api implementation
 */
exports.TwitchApi = class TwitchApi{
    constructor(){
        const OAuth2Store = new store({ name : 'data', encryptionKey : process.env.SESSION_SECRET, },);
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions;
        this.OAuth2Data = OAuth2Store.get('profile',);
        if (this.OAuth2Data !== undefined &&this.OAuth2Data.accessToken === undefined) return log.error(new Error('Missing Token',),);
    }

    /**NOTE for all methods ${this.OAuth2Data.data[0].id} use this after testing */
    getUser(){
        return new Promise((resolve, reject,) => {
            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/users?id=178126684',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    console.log(jsonBody,);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }

    getUserFollows(){
        return new Promise((resolve, reject,) => {
            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/users/follows?to_id=178126684',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }

    getUserSubs(){
        return new Promise((resolve, reject,) => {
            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/subscriptions?broadcaster_id=178126684',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }

    //get top clips
    getTopClips(){
        return new Promise((resolve, reject,) => {

            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/clips?broadcaster_id=178126684&first=5',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }

    getVideos(){
        return new Promise((resolve, reject,) => {

            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/videos?user_id=178126684&first=5',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }

    getLives(){
        return new Promise((resolve, reject,) => {
            this.requestOptions = {
                hostname : 'api.twitch.tv',
                path     : 'helix/streams?user_id=178126684&first=50',
                method   : 'GET',
                port     : 443,
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Accept'        : 'application/vnd.twitchtv.v5+json',
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                },
            };

            let request = https.request(this.requestOptions, (res,) => {
                let data= [];
                res.on('data', (dataChuck,) => {
                    data.push(dataChuck,);
                },);

                res.on('end', () => {
                    let jsonBody = Buffer.concat(data,);
                    jsonBody = JSON.stringify(jsonBody.toString(),);
                    resolve(JSON.parse(jsonBody,),);
                },);

                res.on('error', (err,) => {
                    reject(err,);
                },);
            },);
            request.end();
        },);
    }
};


/**
 * @description Twitch Webhook implementation
 */
exports.TwitchWebhooks = class TwitchWebhooks{
    constructor(){
        const OAuth2Store = new store({ name : 'data', encryptionKey : process.env.SESSION_SECRET, },);
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions;
        this.OAuth2Data = OAuth2Store.get('profile',);
        if (this.OAuth2Data !== undefined &&this.OAuth2Data.accessToken === undefined) throw new Error('Missing access token',);
        //log.info(ngrok.getUrl())

    }

    setUrl(url,){
        return new Promise((resolve, reject,) => {
            if (url){
                this.url = url;
                return resolve(true,);
            } else return reject(new Error('url not provided',),);
        },);
    }
    //ref https://dev.twitch.tv/docs/api/reference/#get-webhook-subscriptions
    subscribeUsers(){
        return new Promise((resolve, reject,) => {
            const options = {
                hostname : 'api.twitch.tv',
                path     : 'helix/webhooks/hub',
                method   : 'POST',
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                    'Content-Type'  : 'application/json',
                },
            };

            var req = https.request(options, (res,) => {
                let data = [];

                res.on('data', (chunck,) => {
                    console.log(chunck,);
                    data.push(chunck,);
                },);

                res.on('close', () => {
                    console.log(data.toString(),);
                    resolve(res.statusCode,);
                },);

                res.on('error', (err,) => {
                    reject(new Error(err,),);
                },);
            },);


            let postData = JSON.stringify({
                'hub.mode'          : 'subscribe',
                'hub.topic'         : 'https://api.twitch.tv/helix/users?id=178126684',
                'hub.callback'      : `${this.url}/twitch/webhook/profile`,//change it to public ip
                'hub.lease_seconds' : '864000',
                'hub.secret'        : process.env.SESSION_SECRET,
            },);

            req.write(postData,);
            req.end();
        },);
    }

    subscribeSubs(){
        return new Promise((resolve, reject,) => {
            const options = {
                hostname : 'api.twitch.tv',
                path     : 'helix/webhooks/hub',
                method   : 'POST',
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                    'Content-Type'  : 'application/json',
                },
            };

            var req = https.request(options, (res,) => {
                let data = [];

                res.on('data', (chunck,) => {
                    console.log(chunck,);
                    data.push(chunck,);
                },);

                res.on('close', () => {
                    console.log(data.toString(),);
                    resolve(res.statusCode,);
                },);

                res.on('error', (err,) => {
                    reject(new Error(err,),);
                },);
            },);


            let postData = JSON.stringify({
                'hub.mode'          : 'subscribe',
                'hub.topic'         : 'https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=178126684&first=1',
                'hub.callback'      : `${this.url}/twitch/webhook/subs`,//change it to public ip
                'hub.lease_seconds' : '864000',
                'hub.secret'        : process.env.SESSION_SECRET,
            },);

            req.write(postData,);
            req.end();
        },);
    }

    subscribeStreams(){
        log.info('Sub Stream',);
        return new Promise((resolve, reject,) => {
            const options = {
                hostname : 'api.twitch.tv',
                path     : 'helix/webhooks/hub',
                method   : 'POST',
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                    'Content-Type'  : 'application/json',
                },
            };

            var req = https.request(options, (res,) => {
                let data = [];

                res.on('data', (chunck,) => {
                    console.log(chunck,);
                    data.push(chunck,);
                },);

                res.on('close', () => {
                    console.log(data.toString(),);
                    resolve(res.statusCode,);
                },);

                res.on('error', (err,) => {
                    reject(new Error(err,),);
                },);
            },);


            let postData = JSON.stringify({
                'hub.mode'          : 'subscribe',
                'hub.topic'         : 'https://api.twitch.tv/helix/streams?user_id=178126684',
                'hub.callback'      : `${this.url}/twitch/webhook/live`,//change it to public ip
                'hub.lease_seconds' : '864000',
                'hub.secret'        : process.env.SESSION_SECRET,
            },);

            req.write(postData,);
            req.end();
        },);
    }

    subscribeFollows(){
        return new Promise((resolve, reject,) => {
            const options = {
                hostname : 'api.twitch.tv',
                path     : 'helix/webhooks/hub',
                method   : 'POST',
                headers  : {
                    'Client-ID'     : this.options.clientID,
                    'Authorization' : 'Bearer ' + this.OAuth2Data.accessToken,
                    'Content-Type'  : 'application/json',
                },
            };

            var req = https.request(options, (res,) => {
                let data = [];

                res.on('data', (chunck,) => {
                    console.log(chunck,);
                    data.push(chunck,);
                },);

                res.on('close', () => {
                    console.log(data.toString(),);
                    resolve(res.statusCode,);
                },);

                res.on('error', (err,) => {
                    reject(new Error(err,),);
                },);
            },);


            let postData = JSON.stringify({
                'hub.mode'          : 'subscribe',
                'hub.topic'         : 'https://api.twitch.tv/helix/users/follows?first=1&to_id=178126684',
                'hub.callback'      : `${this.url}/twitch/webhook/follows`,//change it to public ip
                'hub.lease_seconds' : '864000',
                'hub.secret'        : process.env.SESSION_SECRET,
            },);

            req.write(postData,);
            req.end();
        },);
    }

    /**
     * @description open stream from the express server
     * @returns {<void>}
     */
    openDataStream(){
        log.info('Opening WebHook Data Stream',);
        webHookServer.on('webhook.notification', (data,) => {
            eventEmitter.emit('webhook.notification', data,);
        },);
    }


    //Event to send out
    /**
     * @description event forwarder
     * @param {String} e event name
     * @param {Function} listener listener function
     */
    on(e ,listener,){
        return eventEmitter.on(e, listener,);
    }

    once(e, listener,){
        return eventEmitter.once(e, listener,);
    }

    //unsub ref https://dev.twitch.tv/docs/api/reference/#get-webhook-subscriptions
    unSubAll(){

    }

    //unSubTopic(topic,){
    //
    //}

};
