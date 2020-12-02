const { TwitchApi, } = require('../js/twitchLib',);
const twitchApi = new TwitchApi();
const wxApi = require('../js/weatherApi',);
const settings  = require('electron-settings',);

/**
 * @todo permissions
 * //permission 0 == all, 1 == mod, 2 == author, others vary from 11 to 20
 */

const config = {
    commands : [
        {
            commandString    : 'paolo',
            commandType      : 'defaults',
            isCommandActive  : false,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.paolo',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                try {
                    let res = await twitchApi.getUser();
                    res = JSON.parse(res,);
                    console.log(res,);
                    if (res.data[0] !== undefined) {
                        client.say(channel, res.data[0].description,);
                    } else if (res.message !== undefined) {
                        throw (res.message);
                    } else throw ('Unknown Error on the loop not OK');
                } catch (error) {
                    client.say(channel, error,);
                }
            },
        },
        {
            commandString    : 'social',
            commandType      : 'defaults',
            isCommandActive  : false,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.social',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Socials link tbh use !social',);

            },
        },
        {
            commandString    : 'stick',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.stick',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Stick link tbh use !stick',);
            },
        },
        {
            commandString    : 'tutorials',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.tutorials',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Tutorials link tbh use !social to get my Youtube Channel',);
            },
        },
        {
            commandString    : 'discord',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.discord',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Discord link tbh use !discord',);
            },
        },
        {
            commandString    : 'donate',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.donate',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Il link per le donazioni è streamlabs.com/paolom346_/tip Grazie per il supporto !!',);
            },
        },
        {
            commandString    : 'version',
            commandType      : 'debug',
            isCommandActive  : true,
            isCoolDownActive : false,
            permissions      : 0,
            eventString      : 'default.version',
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Bot version returned: ' + process.env.APP_VERSION + ' permissions: 0',);
            },
        },
        {
            commandString    : 'metar',
            commandType      : 'weather',
            isCommandActive  : true,
            isCoolDownSet    : true,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'weather.metar', //event to be emitted
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel, icao,) {
                if (icao !== undefined && icao.length === 4) {
                    let response = '';
                    try {
                        response = await wxApi.getMetarByIcao(icao,);
                        response = JSON.parse(response,);
                        if (response.data[0] !== undefined)
                            client.say(channel, response.data[0].raw_text,);
                        else client.say(channel, 'Station not found Error 404',);
                    } catch (error) {
                        console.error(error,);
                    }
                    if (this.isCoolDownActive === false && this.isCoolDownSet === true && response !== undefined) {
                        this.isCoolDownActive = true;
                        setTimeout(() => {
                            this.isCoolDownActive = false;
                            console.log('Out from cooldown',);
                        }, parseInt(this.coolDownTime,),);
                    }
                } else return client.say(channel, 'Invalid  Args [SyntaxError] invalid argumet at position 1',);
            },
        },
        {
            commandString    : 'taf',
            commandType      : 'weather',
            isCommandActive  : true,
            isCoolDownSet    : true,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            toggleActive     : async function (index, value,){
                let commandConfig = settings.getSync('config.commadConfig',);
                if (Array.isArray(commandConfig.commands,) === true){
                    commandConfig.commands[index].isCommandActive = value;
                    this.isCommandActive = value;
                    settings.setSync('config.commadConfig', commandConfig,);
                } else throw new Error('The given obj is not array',);
            },
            commandFunction : async function (client, channel, icao,) {
                console.log('Called with icao: ' + icao,);
                if (icao !== undefined && icao.length === 4) {
                    console.log('Called with icao: ' + icao,);
                    let response = '';
                    try {
                        response = await wxApi.getTafByIcao(icao,);
                        response = JSON.parse(response,);
                        if (response.data[0] !== undefined)
                            client.say(channel, response.data[0].raw_text,);
                        else client.say(channel, 'Station not found Error 404',);
                    } catch (error) {
                        console.error(error,);
                    }
                    if (this.isCoolDownActive ===  false && this.isCoolDownSet === true && response !== undefined ){
                        this.isCoolDownActive = true;
                        setTimeout(() => {
                            this.isCoolDownActive = false;
                            console.log('Out from cooldown',);
                        }, parseInt(this.coolDownTime,),);
                    }
                } else client.say(channel, 'Invalid  Args [SyntaxError] invalid argumet at position 1',);
            },
        },
    ],
};

if (settings.getSync('config.commadConfig',) === undefined )
    settings.setSync('config.commadConfig', config,);

exports.configData = config;

