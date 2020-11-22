const { https, } = require('follow-redirects',);

exports.getMetarByIcao =  (icao,) => {
    return new Promise((resolve, reject,) => {
        console.log('Called with icao: '+icao,);
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
            let data = [];
            console.log(request,);

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
                return resolve(JSON.parse(jsonBody,),);
            },);

            res.on('error', (err,) => {
                return reject(err,);
            },);
        },);

        request.end();
    },);
};
