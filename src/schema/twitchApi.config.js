const TwitchConfig = {
    OAuth2ProviderDefaultOptions : {
        clientID : process.env.TWITCH_OAUTH_CLIENT_ID,
        scopes: ['analytics:read:extensions', 'analytics:read:games', 'bits:read ', 'channel:edit:commercial', 'channel:manage:brodcast', 'channel:manage:extension', 'channel:read:hype_train', 'channel:read:subscriptions', 'user:edit', 'user:edit:follows', 'user:read:broadcast', 'user:read:email'],
        refresh: true,
        redirectUri : process.env.TWITCH_OAUTH_REDIRECT_URI
    }
}

module.exports = TwitchConfig;