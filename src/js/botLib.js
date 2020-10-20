const tmi = require('tmi.js');
const settings = require('electron-settings');
const event = require('events');
const utils = require('../helpers/utility');
const log = require('electron-log');
const langLib = require('./langLib').default;

let langObj = langLib() //get app lang

//Question queue global context
let questQueue = [];
let id = 0;

const eventEmitter = new event.EventEmitter()
/** CHAT BOT SECTION **/
//chatbot opts 
const channels = settings.getSync('config.channel');
  const ClientBot = new tmi.Client({
    options: { 
      clientId: process.env.TWITCH_OAUTH_CLIENT_ID,
      debug: true },
    connection: {
      reconnect: true,
      secure: true,
      maxReconnectAttempts:100
    },
    identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_BOT_PASSWORD,
    },
    channels: channels
  })
  
exports.connect = ()=>{
    new Promise((resolve, reject)=>{
       ClientBot.connect().then(()=>{return resolve(true)}).catch((error) => { return reject(error); })
    })
}




ClientBot.on('message', (channel, tags, message, self) => {

  //Command sys
  let prefix = settings.getSync('config.botPrefix')// get settings 
  let messageArr = message.split(' ')//split the message into array

  //get only bot command
  console.log(messageArr[0].includes('!'))
  if (messageArr[0].includes(prefix) !== true) return;
  const args = messageArr[0].slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //log.info(message, tags, channel, self)
  if (command === 'domanda') {
    let questObj = {}
    let messageArr = message.split(' '); // split the string into an Array
    messageArr.shift();// remove command string from message content
    let quest = messageArr.join(' '); //join array
    id = id + 1// increment questId
    //check if the same question is in the array
    console.log(questQueue.length)
    if (questQueue.length > 0) {
      questQueue.map((item) => {
        if (item.question.includes(quest) === true) {
          ClientBot.say(channel, langObj.botMess[2] + item.user) //say no to the user
        } else {
          //build elements and push for render
          questObj = { id: id, user: tags.username, question: quest, channel:channel }
          questQueue.push(questObj);
          questQueue = utils.filterObjArr(questQueue)
          console.log(questQueue)
          eventEmitter.emit('add-quest', questQueue)// send event to UI
        }
      })
    } else {
      console.log('Calling here')
      //if the array is empty take the first question
      questObj = { id: id, user: tags.username, question: quest , channel:channel}
      questQueue.push(questObj);// push before render is committed
      eventEmitter.emit('add-quest', questQueue)
    }
  }

  //status command
  if (command === "status") {
    if (questQueue.length > 0) {
      let index = utils.findIndexInObjArr(questQueue, 'user', tags.username) //find the question in the erray
      if (index === -1) {
        ClientBot.say(channel, langObj.botMess[0]) // 404 not found
      } else {
        index = index + 1;
        ClientBot.say(channel, langObj.botMess[1] + index + langObj.symbols[0]) //send position in the array 
      }
    } else ClientBot.say(channel, langObj.botMess[0])
  }

  if (command === "donate") {
    ClientBot.say(channel, 'Il link per le donazioni è https://streamlabs.com/paolom346_/tip ' + '  Grazie per il supporto ' + tags.username + ' !!')
  }

})

ClientBot.on('connected', (channel) => {
  log.info('Joined channel & listening ');
})


eventEmitter.on('rm-quest', (id)=>{
    questQueue = questQueue.filter(item => item.id !== id)
})


eventEmitter.on('fetch-question-list', ()=>{
    log.info('Sending res')
    eventEmitter.emit('fetch-question-list-res', questQueue)
})

exports.on = (event, listener)=>{
    eventEmitter.on(event, listener)
}

exports.emit =(e, arg)=>{
    eventEmitter.emit(e, arg);
}