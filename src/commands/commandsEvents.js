const { TwitchApi, } = require('../js/twitchLib',);
const twitchApi = new TwitchApi();
const wxApi = require('../js/weatherApi',);
const botLib  = require('../js/botLib',);

botLib.on('default.paolo', async(args,) => {
    try {
        let res = await twitchApi.getUser();
        res = JSON.parse(res,);
        console.log(res,);
        if (res.data[0] !== undefined) {
            args.client.say(args.channel, res.data[0].description,);
        } else if (res.message !== undefined) {
            throw (res.message);
        } else throw ('Unknown Error on the loop not OK');
    } catch (error) {
        args.client.say(args.channel, error,);
    }
},);


botLib.on('default.social', (args,) => {
    args.client.say(args.channel, 'Socials link tbh use !social',);
},);

botLib.on('default.stick', (args,) => {
    args.client.say(args.channel, 'Stick link tbh use !stick',);
},);

botLib.on('default.tutorials', (args,) => {
    args.client.say(args.channel, 'Tutorials link tbh use !social to get my Youtube Channel',);
},);

botLib.on('default.discord', (args,) => {
    args.client.say(args.channel, 'Discord link tbh use !discord',);
},);

botLib.on('default.donate', (args,) => {
    args.client.say(args.channel, 'Il link per le donazioni è streamlabs.com/paolom346_/tip Grazie per il supporto !!',);
},);

botLib.on('default.version', (args,) => {
    args.client.say(args.channel, 'Bot version returned: ' + process.env.APP_VERSION + ' permissions: 0',);
},);


botLib.on('weather.metar', async(args,) => {
    if (args.icao !== undefined && args.icao.length === 4) {
        console.log('Called with icao: ' + args.icao,);
        try {
            let response = await wxApi.getMetarByIcao(args.icao,);
            response = JSON.parse(response,);
            if (response.data[0].raw_text !== undefined)
                args.client.say(args.channel, response.data[0].raw_text,);
            else args.client.say(args.channel, 'Station not found Error 404',);
        } catch (error) {
            console.error(error,);
        }
        //if (this.isCoolDownActive === false && this.isCoolDownSet === true) {
        //    this.isCoolDownActive = true;
        //    setTimeout(() => {
        //        this.isCoolDownActive = false;
        //        console.log('Out from cooldown',);
        //    }, parseInt(this.coolDownTime,));
        //}
    } else return args.client.say(args.channel, 'Invalid  Args [SyntaxError] invalid argumet at position 1',);
},);







