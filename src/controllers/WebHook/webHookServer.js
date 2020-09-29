// Define our dependencies
const TwitchConfig = require('../../schema/twitchApi.config')
const store = require('electron-store');
var express        = require('express');
var session        = require('express-session');
var passport       = require('passport');
const bodyParser   = require('body-parser')
const {https} = require('follow-redirects');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = TwitchConfig.OAuth2ProviderDefaultOptions.clientID;
const TWITCH_SECRET    = process.env.TWITCH_OAUTH_SECRET;
const SESSION_SECRET   = process.env.SESSION_SECRET;
const CALLBACK_URL     = TwitchConfig.OAuth2ProviderDefaultOptions.redirectUri;  // You can run locally with - http://localhost:3000/auth/twitch/callback
const SCOPES = TwitchConfig.OAuth2ProviderDefaultOptions.scopes.join('+');


// Initialize Express and middlewares
var app = express();
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended:true}))

//webhooks implementation


var server = app.listen(process.env.SERVER_APP_PORT, function (err) {
    if (err) throw err;
    console.log('Server is online and listening to port: ' + server.address().port);
});
