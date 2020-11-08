const {TwitchApi} = require('../js/twitchLib')
const twitchApi = new TwitchApi()

/**
 * @todo permissions
 * //permission 0 == all, 1 == mod, 2 == author, others vary from 11 to 20
 */

const config = {
    commands:[
        {
            commandString : 'paolo', 
            commandType: 'defaults', 
            isCommandActive: true,
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                    let res = await twitchApi.getUser();
                    res = JSON.parse(res)
                    console.log(res)
                    if(res.data[0] !== undefined){
                        client.say(channel, res.data[0].description)
                    }else if(res.message !== undefined){
                        throw(res.message)
                    }else throw('Unknown Error on the loop not OK')
                } catch (error) {
                    client.say(channel, error)
                }
            }
        }, 
        {
            commandString : 'social', 
            commandType: 'defaults', 
            isCommandActive: true,
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Socials link tbh use !social')
                } catch (error) {
                    throw error
                }
            }
        },
        {
            commandString : 'stick', 
            commandType: 'defaults', 
            isCommandActive: true,
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Stick link tbh use !stick')
                } catch (error) {
                    throw error
                }
            }
        },
        {
            commandString : 'tutorials',
            commandType: 'defaults', 
            isCommandActive: true, 
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Tutorials link tbh use !social to get my Youtube Channel')
                } catch (error) {
                    throw error
                }
            }
        },
        {
            commandString : 'discord', 
            commandType: 'defaults', 
            isCommandActive: true,
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Discord link tbh use !discord')
                } catch (error) {
                    throw error
                }
            }
        }, 
        {
            commandString : 'donate',
            commandType: 'defaults', 
            isCommandActive: true,
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Il link per le donazioni è streamlabs.com/paolom346_/tip Grazie per il supporto !!')
                } catch (error) {
                    throw error
                }
            }
        },
        {
            commandString : 'version',
            commandType: 'debug', 
            isCommandActive: true, 
            permissions:0,
            commandFunction: async(client, channel)=>{
                try {
                   client.say(channel, 'Bot version returned: '+ process.env.APP_VERSION)
                } catch (error) {
                    throw error
                }
            }
        }
    ]
}

exports.configData = config;