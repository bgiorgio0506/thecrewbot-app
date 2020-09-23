// Define our dependencies
const TwitchConfig = require('../../schema/twitchApi.config')
const store = require('electron-store');
var express        = require('express');
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const {https} = require('follow-redirects');
var handlebars     = require('handlebars');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = TwitchConfig.OAuth2ProviderDefaultOptions.clientID;
const TWITCH_SECRET    = process.env.TWITCH_OAUTH_SECRET;
const SESSION_SECRET   = process.env.SESSION_SECRET;
const CALLBACK_URL     = TwitchConfig.OAuth2ProviderDefaultOptions.redirectUri;  // You can run locally with - http://localhost:3000/auth/twitch/callback
const SCOPES = TwitchConfig.OAuth2ProviderDefaultOptions.scopes.join('+')

// Initialize Express and middlewares
var app = express();
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
//app.use(express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  const options = {
    hostname: 'https://api.twitch.tv',
    path:'/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  var req = https.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
      done(null, JSON.parse(body));
    });
  
    res.on("error", function (error) {
      console.error(error);
      done(JSON.parse(error));
    });
  });
}



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    
    const  OAuth2Store = new store({name:'data',encryptionKey:process.env.SESSION_SECRET});
    OAuth2Store.set({profile: profile});

    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request
app.get('/twitch/start/auth', passport.authenticate('twitch', { scope: SCOPES }));

// Set route for OAuth redirect
app.get('/twitch/auth', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

// Define a simple template to safely generate HTML with values from user's profile
var template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{display_name}}</td></tr>
    <tr><th>Bio</th><td>{{bio}}</td></tr>
    <tr><th>Image</th><td>{{logo}}</td></tr>
</table></html>`);

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', function (req, res) {
  const OAuth2Store = new store({name:'data', encryptionKey: process.env.SESSION_SECRET});
  let OAuth2Data  = OAuth2Store.get('profile');
  if(OAuth2Data === undefined) res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
  else res.send(JSON.stringify(profile))

});

var server = app.listen(process.env.SERVER_APP_PORT, function (err) {
    if (err) throw err;
    console.log('Server is online and listening to port: ' + server.address().port);
});
