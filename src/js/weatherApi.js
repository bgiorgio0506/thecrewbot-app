const { https, } = require('follow-redirects',);

exports.getMetarByIcao =  (icao,) => {
    return new Promise((resolve, reject,) => {
        let requestOptions = {
            method   : 'GET',
            hostname : process.env.WX_HOST_URI,
            path     : `/metar/${icao}/decoded`,
            headers  : {
                'x-api-key' : process.env.WX_API_KEY,
            },
            maxRedirects : 20,
        };
        let request = https.request(requestOptions, (res,) => {
            console.log(request,);
            let data = [];

            res.on('data', (dataChuck,) => {
                data.push(dataChuck,);
            },);

            res.on('end', () => {
                let jsonBody = Buffer.concat(data,);
                jsonBody = JSON.stringify(jsonBody.toString(),);
                resolve(JSON.parse(jsonBody,),);
            },);

            res.on('error', (err,) => {
                reject(err,);
            },);
        },);

        request.end();
    },);
};

exports.getTafByIcao =  (icao,) => {
    return new Promise((resolve, reject,) => {
        let requestOptions = {
            method   : 'GET',
            hostname : process.env.WX_HOST_URI,
            path     : `/taf/${icao}/decoded`,
            headers  : {
                'x-api-key' : process.env.WX_API_KEY,
            },
            maxRedirects : 20,
        };
        let request = https.request(requestOptions, (res,) => {
            console.log(request,);
            let data = [];

            res.on('data', (dataChuck,) => {
                data.push(dataChuck,);
            },);

            res.on('end', () => {
                let jsonBody = Buffer.concat(data,);
                jsonBody = JSON.stringify(jsonBody.toString(),);
                resolve(JSON.parse(jsonBody,),);
            },);

            res.on('error', (err,) => {
                reject(err,);
            },);
        },);

        request.end();
    },);
};
