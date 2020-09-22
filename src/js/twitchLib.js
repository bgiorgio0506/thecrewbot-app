const {https} = require('follow-redirects');
const TwitchConfig = require('../schema/twitchApi.config')
const express  = require('express');

exports.OAuth2Provider = class  OAuth2Provider{
    constructor(){
        //User twitch options
        this.options = TwitchConfig.OAuth2ProviderDefaultOptions
        this.secret  = process.env.TWITCH_OAUTH_SECRET

        //Server options 
        this.app = express()
        this.app.use(require('body-parser'))
        this.app.use(express.json)

        //open Up server
        this.server = app.listen(process.env.SERVER_APP_PORT || 3000, function (err) {
            if (err) throw err;
            console.log('Server is online and listening to port: ' + server.address().port);
        });
    }

}