const { TwitchApi, } = require('../js/twitchLib',);
const twitchApi = new TwitchApi();
const wxApi = require('../js/weatherApi',);
const settings  = require('electron-settings',);
const event = require('events',);
const eventEmitter  = new event.EventEmitter();
const path  = require('path',);

/**
 * @todo permissions
 * //permission 0 == all, 1 == mod, 2 == author, 11 === sub, others vary from 11 to 20
 */

const config = {
    version  : 12122020,
    commands : [
        {
            commandString    : 'paolo',
            commandType      : 'defaults',
            isCommandActive  : false,
            iisCoolDownSet   : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.paolo',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
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
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.social',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Socials link tbh use !social',);

            },
        },
        {
            commandString    : 'stick',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.stick',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Stick link tbh use !stick',);
            },
        },
        {
            commandString    : 'tutorials',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.tutorials',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Tutorials link tbh use !social to get my Youtube Channel',);
            },
        },
        {
            commandString    : 'discord',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.discord',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Discord link tbh use !discord',);
            },
        },
        {
            commandString    : 'donate',
            commandType      : 'defaults',
            isCommandActive  : true,
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.donate',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel,) {
                client.say(channel, 'Il link per le donazioni è streamlabs.com/paolom346_/tip Grazie per il supporto !!',);
            },
        },
        {
            commandString    : 'version',
            commandType      : 'debug',
            isCommandActive  : true,
            isCoolDownSet    : false,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 0,
            eventString      : 'default.version',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
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
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
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
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
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
        {
            commandString    : 'commercial',
            commandType      : 'moderation',
            isCommandActive  : true,
            isCoolDownSet    : true,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 1,
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async function (client, channel, duration,){
                let length = parseInt(duration,);
                if (length !== 180 || length !== 150 || length !== 120 || length !== 90 || length !== 60 || length !== 30)
                    length = 90;
                let response = await twitchApi.startCommercial(length,);
                response = JSON.parse(response,);
                console.log(response,);
                if (this.isCoolDownActive ===  false && this.isCoolDownSet === true && response !== undefined ){
                    this.isCoolDownActive = true;
                    setTimeout(() => {
                        this.isCoolDownActive = false;
                        console.log('Out from cooldown',);
                    }, parseInt(this.coolDownTime,),);
                }
            },
        },
        /*{
            commandString    : 'ding',
            commandType      : 'audio',
            isCommandActive  : false, // do not active the sound command for now;
            isCoolDownSet    : true,
            isCoolDownActive : false,
            coolDownTime     : 30000,
            permissions      : 11,
            fileDirectory    : path.resolve(process.env.APPDATA, 'AudioFiles\\',),
            fileName         : 'ding.mp3',
            setPermission    : async function (index, key, value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            toggleActive : async function (index, key , value,){
                eventEmitter.emit('settings-handler', { index : index, key : key, value : value, },);
            },
            commandFunction : async (client, channel,) => {
                let AudioPathFile = 'C:\\Users\\Giorgiopc\\AppData\\Roaming\\AudioFiles\\ding.mp3';
                eventEmitter.emit('play-sound', AudioPathFile,);
            },
        },*/
    ],
};

if (settings.getSync('config.commadConfig',) === undefined )
    settings.setSync('config.commadConfig', config,);
else if (settings.getSync('config.commadConfig.version',) !== config.version)
    settings.setSync('config.commadConfig', config,);
/**
 * @description this is the general setting handler,
 */
eventEmitter.on('settings-handler', ({ index, key, value, },) => {
    let commandConfig = settings.getSync('config.commadConfig',);
    if (Array.isArray(commandConfig.commands,) === true){
        commandConfig.commands[index][key] = value;
        console.log(commandConfig.commands[index][key],);

        //set  temp proprety;
        config.commands[index][key] = value;
        settings.setSync('config.commadConfig', commandConfig,);
    } else throw new Error('The given obj is not array',);
},);

exports.configData = config;
exports.on = (event , listener, ) => {
    return eventEmitter.on(event,listener,);
};
