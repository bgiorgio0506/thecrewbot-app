// Define our dependencies
const TwitchConfig = require('../../schema/twitchApi.config')
const store = require('electron-store');
var express        = require('express');
var session        = require('express-session');
const bodyParser   = require('body-parser')
const crypto       = require('crypto')
const path         = require('path')
const fs           = require('fs')
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

// Middleware!
// Express allows whats called middle ware
// it runs before (or after) other parts of the route runs
app.use(bodyParser.json({
    verify: function(req, res, buf, encoding) {
        // is there a hub to verify against
        req.twitch_hub = false;
        if (req.headers && req.headers['x-hub-signature']) {
            req.twitch_hub = true;

            var xHub = req.headers['x-hub-signature'].split('=');

            req.twitch_hex = crypto.createHmac(xHub[0], process.env.TWITCH_OAUTH_SECRET)
                .update(buf)
                .digest('hex');
            req.twitch_signature = xHub[1];
        }
    }
}));

//webhooks implementation
// Routes
app.route('/').get((req, res) => {
        console.log('Incoming Get request on /');
        // Twitch will send a verfiy to your handler
        // in order to verify that it can be access
        // we'll test if the call is from Twitch
        // the key contats a period so we are using array style access here
        if (req.query['hub.challenge']) {
            console.log('Got a challenge', req.query['hub.challenge']);
            // it's a challenge from Twitch
            // lets acknowledge it
            res.send(req.query['hub.challenge']);
        } else {
            console.log('Got a weird, no challenge');
            // normally won't get called
            // but we need to return something
            // someone direct called the URL for whatever reason
            // so we'll just OK and be done with it
            res.send('Ok');
        }
    }).post((req, res) => {
        console.log('Incoming Post request on /');
        // the middleware above ran
        // and it prepared the tests for us
        // so check if we event generated a twitch_hub
        if (req.twitch_hub) {
            if (req.twitch_hex == req.twitch_signature) {
                console.log('The signature matched');
                // the signature passed so it should be a valid payload from Twitch
                // we ok as quickly as possible
                res.send('Ok');

                // you can do whatever you want with the data
                // it's in req.body

                // write out the data to a log for now
                fs.appendFileSync(path.join(
                    __dirname,
                    'webhooks.log'
                ), JSON.stringify(req.body) + "\n");
                // pretty print the last webhook to a file
                fs.appendFileSync(path.join(
                    __dirname,
                    'last_webhooks.log'
                ), JSON.stringify(req.body, null, 4));
            } else {
                console.log('The Signature did not match');
                // the signature was invalid
                res.send('Ok');
                // we'll ok for now but there are other options
            }
        } else {
            console.log('It didn\'t seem to be a Twitch Hook');
            // again, not normally called
            // but dump out a OK
            res.send('Ok');
        }
    });


var server = app.listen(process.env.SERVER_APP_PORT, function (err) {
    if (err) throw err;
    console.log('Server is online and listening to port: ' + server.address().port);
});
