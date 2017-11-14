var request = require('request');
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('127.0.0.1/Environment', ['ThingStation','ThingTelemetry'])
var db2 = mongojs('127.0.0.1/Correlation', ['correlation'])
   


function getThingStation(){
    return new Promise ( function (resolve,reject){
        db.ThingStation.find({}, { 'id': 1, '_id': 0 }, (err, document) => {
            console.log('success')
            resolve(document)
        })
    })
}

function getEnviromentByThingId(thing_id, array){
    // Option for local database
    
    return new Promise ( function (resolve,reject){
        db.ThingTelemetry.find({'thingId':thing_id}, {'_id': 0,'telemetries.value':1 }).limit(12).sort({'_id':-1} , (err, document) => {
            try{
                array[thing_id] = document
                console.log(array)
                resolve(document)
            } catch (e) {
                console.log('error ' + e); // error in the above string (in this case, yes)!
            }
        })
    })
}



function cronSaveEnviroment(){
    new CronJob('*/1 * * * *', function () {
        let array = {}
        getThingStation().then(result => result.forEach(doc => {
            getEnviromentByThingId(doc['id'], array).then(result => console.log("success"))
        }))
    }, null, true, "Asia/Bangkok");
}
cronSaveEnviroment()


