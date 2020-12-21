const tmi = require('tmi.js',);
const settings = require('electron-settings',);
const event = require('events',);
const utils = require('../helpers/utility',);
const log = require('electron-log',);
const langLib = require('./langLib',).default;
const { configData, on, }= require('../schema/commandConfig',);

let langObj = langLib(); //get app lang

//Question queue global context
let questQueue = [];
let id = 0;

const eventEmitter = new event.EventEmitter();
/** CHAT BOT SECTION **/
//chatbot opts
const channels = settings.getSync('config.channel',);
const ClientBot = new tmi.Client({
    options : {
        clientId : process.env.TWITCH_OAUTH_CLIENT_ID,
        debug    : true, },
    connection : {
        reconnect            : true,
        secure               : true,
        maxReconnectAttempts : 100,
    },
    identity : {
        username : process.env.TWITCH_BOT_USERNAME,
        password : process.env.TWITCH_BOT_PASSWORD,
    },
    channels : channels,
},);

exports.connect = () => {
    new Promise((resolve, reject,) => {
        ClientBot.connect().then(() => { return resolve(true,); },).catch((error,) => { return reject(error,); },);
    },);
};




ClientBot.on('message', async(channel, tags, message,) => {

    //Command sys
    let prefix = settings.getSync('config.botPrefix',);// get settings
    let messageArr = message.split(' ',);//split the message into array

    //get only bot command
    console.log(messageArr[0].includes(prefix,),);
    if (messageArr[0].includes(prefix,) !== true) return;
    const args = messageArr[0].slice(prefix.length,).trim().split(/ +/g,);
    const command = args.shift().toLowerCase();
    let commandIndex = utils.findIndexInObjArr(configData.commands, 'commandString', command,);
    const persistenConfig = settings.getSync('config.commadConfig',);

    if (command === 'domanda') {
        let questObj = {};
        let messageArr = message.split(' ',); // split the string into an Array
        messageArr.shift();// remove command string from message content
        let quest = messageArr.join(' ',); //join array
        id = id + 1;// increment questId
        //check if the same question is in the array
        console.log(questQueue.length,);
        if (questQueue.length > 0) {
            questQueue.map((item,) => {
                if (item.question.includes(quest,) === true) {
                    ClientBot.say(channel, langObj.botMess[2] + item.user,); //say no to the user
                } else {
                    //build elements and push for render
                    questObj = { id : id, user : tags.username, question : quest, channel : channel, };
                    questQueue.push(questObj,);
                    questQueue = utils.filterObjArr(questQueue,);
                    console.log(questQueue,);
                    eventEmitter.emit('add-quest', questQueue,);// send event to UI
                }
            },);
        } else {
            console.log('Calling here',);
            //if the array is empty take the first question
            questObj = { id : id, user : tags.username, question : quest , channel : channel, };
            questQueue.push(questObj,);// push before render is committed
            eventEmitter.emit('add-quest', questQueue,);
        }
    }

    //status command
    if (command === 'status') {
        if (questQueue.length > 0) {
            let index = utils.findIndexInObjArr(questQueue, 'user', tags.username,); //find the question in the erray
            if (index === -1) {
                ClientBot.say(channel, langObj.botMess[0],); // 404 not found
            } else {
                index = index + 1;
                ClientBot.say(channel, langObj.botMess[1] + index + langObj.symbols[0],); //send position in the array
            }
        } else ClientBot.say(channel, langObj.botMess[0],);
    }

    //debug command
    if (command === 'totaldynamicommands'){
        ClientBot.say(channel, configData.commands.length.toString(),);
    }


    // debug mod command
    if (command  === 'toggleactive' && tags.mod === true){
        let commandPos = utils.findIndexInObjArr(configData.commands, 'commandString', messageArr[1],);
        if (commandPos !== -1){
            let commandObj = persistenConfig.commands[commandPos];
            eventEmitter.emit('command-setting-changed',);
            if (commandObj.isCommandActive === true) {
                await configData.commands[commandPos].toggleActive(commandPos, 'isCommandActive' , false,);
                ClientBot.say(channel, 'Command disactivated',);
            } else {
                await configData.commands[commandPos].toggleActive(commandPos, 'isCommandActive' , true,);
                ClientBot.say(channel, 'Command activated',);
            }
        }
    }


    //dynamic bot commands
    //log.info(commandIndex+ ' '+ command,);
    if (commandIndex !== -1){
        //pick the command obj
        let commandObj = configData.commands[commandIndex];
        let persistentCommand = persistenConfig.commands[commandIndex];
        log.info(commandIndex, persistentCommand,);
        //check for coolDown
        if (persistentCommand.isCommandActive === true && commandObj.isCoolDownActive === false) {
            //check for permission setting
            if (persistentCommand.permissions === 1)
            //check user perm
                if (tags.mod === true)
                    //eventEmitter.emit(commandObj.eventString, { client : ClientBot, channel : channel, commandObject : commandObj ,icao : messageArr[1], },);
                    await commandObj.commandFunction(ClientBot, channel, messageArr[1],);
                //await commandObj.commandFunction(ClientBot, channel, messageArr[1],);
                else ClientBot.say(channel, 'You are not allowed to use this command please stop spamming',);
            else await commandObj.commandFunction(ClientBot, channel, messageArr[1],);
        }
        else if ( commandObj.isCoolDownActive === true)  ClientBot.say(channel, 'Command on cooldown',);
        else log.info('Command deactivated',); //command deactivated
    }


},);

ClientBot.on('connected', () => {
    log.info('Joined channel & listening ',);
    eventEmitter.emit('connected',);
},);

on('play-sound', (AudioPathFile,) => {
    eventEmitter.emit('play-sound', AudioPathFile,);
},);

eventEmitter.on('rm-quest', (id,) => {
    questQueue = questQueue.filter((item,) => item.id !== id,);
},);


eventEmitter.on('fetch-question-list', () => {
    log.info('Sending res',);
    return eventEmitter.emit('fetch-question-list-res', questQueue,);
},);


//outbound listening for internal events
exports.on = (event, listener,) => {
    return eventEmitter.on(event, listener,);
};

//inbound emit for internal listening
exports.emit =(e, arg,) => {
    return eventEmitter.emit(e, arg,);
};

exports.removeCommand = (commandIndex,) => {
    let date = new Date();
    let commandArr = configData.commands;
    if (commandArr[commandIndex] !== undefined){
        delete commandArr[commandIndex];
        settings.setSync('config.commadConfig', commandArr,);
        settings.setSync('config.commadConfig.version', date.toDateString(),);
        configData.version = date.toDateString();
    }
};
