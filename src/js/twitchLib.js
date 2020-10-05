const {http, https} = require('follow-redirects');
const store = require('electron-store');
const TwitchConfig = require('../schema/twitchApi.config');
const ngrok = require('ngrok');
const url = (async () => {
    await ngrok.connect({
        proto: 'http', // http|tcp|tls, defaults to http
        addr: parseInt(process.env.WEBHOOK_APP_PORT), // port or network address, defaults to 80
        region: 'eu', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
        binPath: path => path.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
        onStatusChange: status => { log.info(status) }, // 'closed' - connection is lost, 'connected' - reconnected
        onLogEvent: data => { log.info(data) }, // returns stdout messages from ngrok process
    })
});
const log = require('electron-log')



exports.OAuth2Provider = class  OAuth2Provider{

    /**
     * @description class constructor
     */
    constructor(){
        //User twitch options
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions
        this.secret  = process.env.TWITCH_OAUTH_SECRET
    }

    /**
     * @description start Oauth2 flow
     */
    startOAuth2Strategy(){
        return new Promise((resolve, reject)=>{
            let options = {
                hostname: 'localhost', 
                port:process.env.SERVER_APP_PORT,
                path: '/',
                maxRedirexts: 20,
                method: 'GET'
            }
    
            let req = http.request(options, (res)=>{
                let chunks = [];
                    res.on('data', (chunk)=>{
                        chunks.push(chunk)
                    })
                    
                    res.on('error', (err)=>{
                        return reject(err)
                    })

                    res.on('end', ()=>{
                        let responseBody =  Buffer.concat(chunks)
                        responseBody = responseBody.toString();
                        try {
                            let jsonBody = JSON.parse(responseBody)
                            console.log(jsonBody)
                            return resolve(jsonBody)
                        } catch (error) {
                            return resolve(responseBody.toString())
                        }
                    })
            });

            req.end();
        })
    }

    /**
     * @description returns OAuth2 profile data
     */
    getOAuth2Data(){
        return new Promise((resolve, reject)=>{
            const OAuth2Store = new store({name:'data', encryptionKey: process.env.SESSION_SECRET});
            let OAuth2Data  = OAuth2Store.get('profile');
            if(OAuth2Data === undefined ) return resolve(null);
            else return resolve(OAuth2Data);
        })

    }

    /**
     * @desription refresh token
     */
    refreshOAuth2Token(){
        return new Promise((resolve, reject)=>{
        const OAuth2Store = new store({name:'data', encryptionKey: process.env.SESSION_SECRET});
        let OAuth2Data  = OAuth2Store.get('profile');
        if(OAuth2Data === undefined ) return resolve(null);
        else{
            const options = {
                hostname: 'id.twitch.tv', 
                path: `/oauth2/token?grant_type=refresh_token&refresh_token=${OAuth2Data.refreshToken}&client_id=${this.options.clientID}&client_secret=${process.env.TWITCH_OAUTH_SECRET}&scope=${decodeURIComponent(this.options.scopes.join('+'))}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, 

            }
            let request = https.request(options, (res)=>{
                console.log(res.statusCode); 
                let data = [];
                res.on('data', (dataChuck)=>{
                    data.push(dataChuck);
                }); 

                res.on('end', (dataChuck)=>{
                    let parsedBody = JSON.parse(data.toString());
                    OAuth2Data.accessToken = parsedBody.access_token;
                    OAuth2Data.refreshToken = parsedBody.refresh_token;
                    OAuth2Data.expires_in = parsedBody.expires_in;
                    OAuth2Store.set({profile:OAuth2Data})
                    resolve(true)
                })
                
                res.on('error', (err)=>{
                    reject(err)
                })
            })
            request.end()
        }
        })
    }

}

/**
 * @description a twitch api implementation
 */
exports.TwitchApi = class TwitchApi{
    constructor(){
        const OAuth2Store = new store({name:'data', encryptionKey:process.env.SESSION_SECRET});
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions;
        this.OAuth2Data = OAuth2Store.get('profile');
        if(this.OAuth2Data !== undefined &&this.OAuth2Data.accessToken === undefined) throw new Error('Missing access token')
    }

    getUser(){
        return new Promise((resolve, reject)=>{
            this.requestOptions = {
                hostname: 'api.twitch.tv', 
                path :`helix/users?id=${this.OAuth2Data.data[0].id}`, 
                method:'GET', 
                port:443,
                headers: {
                    'Client-ID': this.options.clientID,
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': 'Bearer ' + this.OAuth2Data.accessToken
                }
            }

            let request = https.request(this.requestOptions, (res)=>{
                let data= [];
                res.on('data', (dataChuck)=>{
                    data.push(dataChuck);
                })

                res.on('end', (dataChuck)=>{
                    let jsonBody = Buffer.concat(data);
                    jsonBody = JSON.stringify(jsonBody.toString())
                    resolve(JSON.parse(jsonBody));
                })

                res.on('error', (err)=>{
                    reject(err)
                })
            })
             request.end()
        })
    }

    getUserFollows(){
        return new Promise((resolve, reject)=>{
            this.requestOptions = {
                hostname: 'api.twitch.tv', 
                path :`helix/users/follows?to_id=${this.OAuth2Data.data[0].id}`, 
                method:'GET', 
                port:443,
                headers: {
                    'Client-ID': this.options.clientID,
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': 'Bearer ' + this.OAuth2Data.accessToken
                }
            }

            let request = https.request(this.requestOptions, (res)=>{
                let data= [];
                res.on('data', (dataChuck)=>{
                    data.push(dataChuck);
                })

                res.on('end', (dataChuck)=>{
                    let jsonBody = Buffer.concat(data);
                    jsonBody = JSON.stringify(jsonBody.toString())
                    resolve(JSON.parse(jsonBody));
                })

                res.on('error', (err)=>{
                    reject(err)
                })
            })
             request.end()
        })
    }

    getUserSubs(){
        return new Promise((resolve, reject)=>{
            this.requestOptions = {
                hostname: 'api.twitch.tv', 
                path :`helix/subscriptions?broadcaster_id=${this.OAuth2Data.data[0].id}`, 
                method:'GET', 
                port:443,
                headers: {
                    'Client-ID': this.options.clientID,
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': 'Bearer ' + this.OAuth2Data.accessToken
                }
            }

            let request = https.request(this.requestOptions, (res)=>{
                let data= [];
                res.on('data', (dataChuck)=>{
                    data.push(dataChuck);
                })

                res.on('end', (dataChuck)=>{
                    let jsonBody = Buffer.concat(data);
                    jsonBody = JSON.stringify(jsonBody.toString())
                    resolve(JSON.parse(jsonBody));
                })

                res.on('error', (err)=>{
                    reject(err)
                })
            })
             request.end()
        })
    }
}

exports.TwitchWebhooks = class TwitchWebhooks{
    constructor(){
        const OAuth2Store = new store({name:'data', encryptionKey:process.env.SESSION_SECRET});
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions;
        this.OAuth2Data = OAuth2Store.get('profile');
        if(this.OAuth2Data !== undefined &&this.OAuth2Data.accessToken === undefined) throw new Error('Missing access token'); 
        //log.info(ngrok.getUrl())
    }

    //ref https://dev.twitch.tv/docs/api/reference/#get-webhook-subscriptions
    subscribeUsers(){

    }

    subscribeSubs(){
        
    }

    subscribeFollows(){
        return new Promise((resolve, reject)=>{
            const options = {
                hostname: 'api.twitch.tv', 
                path: 'helix/webhooks/hub',
                method: 'POST',
                headers: {
                    'Client-ID':this.options.clientID,
                    'Authorization': 'Bearer ' + this.OAuth2Data.accessToken,
                    'Content-Type': 'application/json'
                }
            };

            var req = https.request(options, (res)=>{
                let data = []
                console.log(res.statusCode)
                res.on('data', (chunck)=>{
                    console.log(chunck)
                    data.push(chunck)
                })

                res.on('close', (chunk)=>{
                    console.log(data.toString())
                    resolve(res.statusCode)
                })

                res.on('error', (err)=>{
                    reject(new Error(err))
                })
            })

        
            let postData = JSON.stringify({
                'hub.mode': 'subscribe',
                'hub.topic': 'https://api.twitch.tv/helix/users/follows?first=1&to_id=117191228',
                'hub.callback': `${ngrok.getUrl}/twitch/webhook/follows`,//change it to public ip
                'hub.lease_seconds': '30000',
                'hub.secret': process.env.SESSION_SECRET
            })

            req.write(postData)
            req.end()
        })
    }

    receiveUsers(){

    }

    receiveSubs(){
        
    }

    receiveFollows(){
        
    }

    //Event to send out
    on(){

    }

    once(){

    }

    //unsub ref https://dev.twitch.tv/docs/api/reference/#get-webhook-subscriptions
    unSubAll(){

    }

    unSubTopic(){
        
    }
    
}