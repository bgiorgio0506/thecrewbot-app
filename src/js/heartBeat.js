const { https, } = require('follow-redirects',);

exports.sendHeartBeat = () => {
    return new Promise((resolve, reject,) => {
        let options = {
            hostname     : 'thecrewbot.it',
            path         : '/heartbeat',
            maxRedirexts : 20,
            method       : 'GET',
        };

        let req = https.request(options, (res,) => {
            let chunks = [];
            res.on('data', (chunk,) => {
                chunks.push(chunk,);
            },);

            res.on('error', (err,) => {
                return reject(err,);
            },);

            res.on('end', () => {
                let responseBody =  Buffer.concat(chunks,);
                responseBody = responseBody.toString();
                try {
                    return resolve(responseBody,);
                } catch (error) {
                    return resolve(responseBody.toString(),);
                }
            },);
        },);

        req.end();
    },);
};
