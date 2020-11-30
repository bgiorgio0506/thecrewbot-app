const { net, } = require('electron',);

/**@todo rewrite api method with electron api */

exports.getMetarByIcao = (icao,) => {
    return new Promise((resolve, reject,) => {
        // method   : 'GET',
        let requestOptions = {
            method   : 'GET',
            hostname : process.env.WX_HOST_URI,
            path     : `/metar/${icao}/decoded`,
            protocol : 'https:',
            redirect : 'follow',
        };

        const  request = net.request(requestOptions,);

        request.setHeader('x-api-key', process.env.WX_API_KEY,);

        request.on('response', (res,) => {
            let data = [];

            console.log(`STATUS: ${res.statusCode}`,);
            console.log(`HEADERS: ${JSON.stringify(res.headers,) }`,);
            res.on('data', (dataChuck,) => {
                data.push(dataChuck,);
                console.log(dataChuck,);
            },);

            res.on('end', () => {
                let jsonBody = Buffer.concat(data,);
                jsonBody = JSON.stringify(jsonBody.toString(),);
                console.log(jsonBody,);
                return resolve(JSON.parse(jsonBody,),);
            },);

            res.on('error', (err,) => {
                console.error(err,);
                return reject(err,);
            },);
        },);

        request.on('error', (err,) => {
            throw err;
        },);

        request.on('redirect', () => {
            request.followRedirect();
        },);

        request.end();
    },);
};

exports.getTafByIcao = (icao,) => {
    return new Promise((resolve, reject,) => {
        let requestOptions = {
            method   : 'GET',
            hostname : process.env.WX_HOST_URI,
            path     : `/taf/${icao}/decoded`,
            protocol : 'https:',
            redirect : 'follow',
        };

        const  request = net.request(requestOptions,);

        request.setHeader('x-api-key', process.env.WX_API_KEY,);

        request.on('response', (res,) => {
            let data = [];

            console.log(`STATUS: ${res.statusCode}`,);
            console.log(`HEADERS: ${JSON.stringify(res.headers,) }`,);
            res.on('data', (dataChuck,) => {
                data.push(dataChuck,);
                console.log(dataChuck,);
            },);

            res.on('end', () => {
                let jsonBody = Buffer.concat(data,);
                jsonBody = JSON.stringify(jsonBody.toString(),);
                console.log(jsonBody,);
                return resolve(JSON.parse(jsonBody,),);
            },);

            res.on('error', (err,) => {
                console.error(err,);
                return reject(err,);
            },);
        },);

        request.on('error', (err,) => {
            throw err;
        },);

        request.on('redirect', () => {
            request.followRedirect();
        },);

        request.end();
    },);
};
