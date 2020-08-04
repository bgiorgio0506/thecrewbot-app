// Import dependencies
import React from 'react'
import ReactDOM from 'react-dom'
import { ipcRenderer, remote } from 'electron'
import App from './components/app'
import Error from './components/error'
const tmi = require('tmi.js');
import './assets/css/app.css'
console.log('This line is begin called before app rendering')

//Question queue
let questQueue = []

const ClientBot = new tmi.Client({
    options: { debug: true },
	connection: {
        reconnect: true,
        secure: true
	},
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_PASSWORD,
    },
    channels:['paolom346_']
})

ClientBot.connect().catch((error)=>{throw error;})

ClientBot.on('message', (channel, tags, message, self)=>{
    //console.log(message, tags, channel, self)
    if(message.includes('!secret') === true){
        let messageArr = message.split(' '); // split the string into an Array
        messageArr.shift();// remove command string from message content
        let quest = messageArr.join(' '); //join array
        questQueue.push({ user:tags.username, question:quest, position: questQueue.length+1}); // add to queue array
        console.log(questQueue) // debug log
        ClientBot.say(channel, '***Test DATA received***\n  secret: '+ quest + '\n secretPosto: '+ questQueue.length); //send user response
    }
})

ClientBot.on('connected', ()=>{
    console.log('Joined channel')
})

setInterval(()=>{
    ClientBot.say('paolom346_','*****This is a test***** \nfrom' + process.env.APP_NAME + '\n  version: ' + process.env.APP_VERSION + '\n on platform: ' + process.platform+ '\n Debug : '+ process.env.APP_DEBUG)
}, 20000)



// Render the app into the root div
const render = () => {
    ReactDOM.render(<div>Test.</div>, document.getElementById('root'));
}

render()