const express = require('express');
const Server = express();
const request = require('request');
const helpers = require('./Helpers');

export default function handler(req, res) {
    
    let requestIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['HTTP_CLIENT_IP'] || req.headers['X-Real-IP'] || req.headers['HTTP_X_FORWARDED_FOR'];
    if (requestIP.substr(0, 7) === "::ffff:") {
        requestIP = requestIP.substr(7)
    }
    request('https://ipinfo.io/' + requestIP + '/json', function (err, body, ipData) {
        ipData = JSON.parse(ipData);
        if (err) res.send(requestIP);
        else {
            request('https://ipinfo.io/json', function (err, body, serverData) {
                serverData = JSON.parse(serverData);
                if (err) res.send(`${requestIP} - ${ipData.org}, ${ipData.country}`);
                else if (ipData.loc && serverData.loc) {
                    const d = helpers.calcDistance(ipData.loc.split(','), serverData.loc.split(','));
                    res.send(`${requestIP} - ${ipData.org}, ${ipData.country} (${d}km)`);
                } else {
                    res.send(`${requestIP} - ${ipData.org}, ${ipData.country}`);
                }
            })
        }
    });

}
  
