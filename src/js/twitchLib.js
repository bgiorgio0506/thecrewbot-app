const {http} = require('follow-redirects');
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
                        return resolve(responseBody.toString())
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
            if(OAuth2Data === undefined ) return reject(new Error('No data stored'));
            else return resolve(OAuth2Data);
        })

    }


}