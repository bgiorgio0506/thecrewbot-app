const {http, https} = require('follow-redirects');
const store = require('electron-store');
const TwitchConfig = require('../schema/twitchApi.config');
require('../controllers/OAuth2Server/OAuth2Server ')


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
        if(this.OAuth2Data !== undefined &&this.OAuth2Data.accessToken === undefined) throw new Error('Missing access token')
    }
    
}