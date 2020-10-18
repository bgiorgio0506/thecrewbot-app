const {http, https} = require('follow-redirects');

exports.sendHeartBeat = ()=>{
    return new Promise((resolve, reject)=>{
        let options = {
            hostname: 'thecrewbot.loca.lt', 
            path: '/heartbeat',
            maxRedirexts: 20,
            method: 'GET'
        }

        let req = https.request(options, (res)=>{
            let chunks = [];
                res.on('data', (chunk)=>{
                    chunks.push(chunk)
                })
                
                res.on('error', (err)=>{
                    return reject(err)
                })

                res.on('end', ()=>{
                    let responseBody =  Buffer.concat(chunks)
                    responseBody = responseBody.toString();
                    try {
                        console.log(jsonBody)
                        return resolve(jsonBody)
                    } catch (error) {
                        return resolve(responseBody.toString())
                    }
                })
        });

        req.end();
    })
}