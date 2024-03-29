var request = require('request');
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('mongodb://localhost:27017/SmartMobility', ['taxiRawData','taxiData'])

var options = {
    method: 'POST',
    url : 'https://taxi-api.gtaxi.transcodeglobal.com/authority/api/1.0.2/taxi/pool/8W7mc0ZUx43bx',
    headers: {
        'Authorization': 'Basic eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdHlfaWQiOiI1OWE2MzFiYTYwYmRlNjAwNTU5NjAyODgiLCJ1c2VybmFtZSI6InRlc3RlciIsImZsZWV0X2lkIjoiQVRUIiwiaWF0IjoxNTA0MDYzOTU4fQ.gzOJ40y375t84enWOIvO3Cr1d5NhNPysFevMPrY9a2feGcWFUEwO3kYnZaHD6pvnjPUSNdGXPM-85yihQygHXg',
        'Content-Type': 'application/json'
    },
    body: 
    {
        "page":0,
        "limit":1000,
        "q":{
            "st_lic":"",
            "fleet_id":"ATT"
        },
        "map":["id","taxi_id","fleet_id","taxi_type","license_plate","driver","gps","service"]
    },
    json: true
}

function saveDataCron(){
    new CronJob('*/1 * * * *', function () {
        request(options, function (err, response, body) {
            if (err) { console.log("err " + err); return; }
            try {
                body['pl_taxis']
                //console.log(body['pl_taxis'])
                let data = {}
                data['data'] = body['pl_taxis']
                db.taxiData.insert(data)
            } catch (e) {
                console.log('error ' + e); // error in the above string (in this case, yes)!
            }
        })

    }, null, true, "Asia/Bangkok");
}

saveDataCron()
