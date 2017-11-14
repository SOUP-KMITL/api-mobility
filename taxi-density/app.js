//var taxi_data = require('./taxi-gps.json')
var CronJob = require('cron').CronJob;
var mongojs = require('mongojs')
var db = mongojs('mongodb://localhost:27017/SmartMobility', ['taxiData','taxiDensity'])

// console.log(taxi_data)
// console.log(taxi_data['pl_taxis'][0]['gps'])
var zone1 = [13.744580, 13.749250, 100.540000, 100.541000] //Ratchadumri road 1
var zone2 = [13.730000, 13.744500, 100.536428, 100.540640] //Ratchadumri road 2
var zone3 = [13.744392, 13.746709, 100.531000, 100.540000] //Siam road
var zone4 = [13.746300, 13.752852, 100.530413, 100.531922] //Phayathai road 1
var zone5 = [13.733318, 13.745956, 100.528322, 100.530966] //Phayathai road 2


function getTaxiDensity() {
    new CronJob('*/1 * * * *', function () {
        let json = {}
        let count1 = 0, count2 = 0, count3 = 0, count4 = 0, count5 = 0
        db.taxiData.find().limit(1).sort({ '_id': -1 }, function (err, docs) {
            if (err)
                console.log(err)
	    console.log('processing')
            docs['0']['data'].forEach(function (element) {
                //console.log('processing - foreach')
                let data = element
                let geolocation = element['gps']['loc']['coordinates']
                console.log(geolocation)
                //gps - long,lat [ 100.56058654, 13.84632562 ]
                if (geolocation[1] > zone1[0] && geolocation[1] < zone1[1] && geolocation[0] > zone1[2] && geolocation[0] < zone1[3])
                    count1++
                else if (geolocation[1] > zone2[0] && geolocation[1] < zone2[1] && geolocation[0] > zone2[2] && geolocation[0] < zone2[3])
                    count2++
                else if (geolocation[1] > zone3[0] && geolocation[1] < zone3[1] && geolocation[0] > zone3[2] && geolocation[0] < zone3[3])
                    count3++
                else if (geolocation[1] > zone4[0] && geolocation[1] < zone4[1] && geolocation[0] > zone4[2] && geolocation[0] < zone4[3])
                    count4++
                else if (geolocation[1] > zone5[0] && geolocation[1] < zone5[1] && geolocation[0] > zone5[2] && geolocation[0] < zone5[3])
                    count5++
            }, this);
            json['zone1'] = count1
            json['zone2'] = count2
            json['zone3'] = count3
            json['zone4'] = count4
            json['zone5'] = count5
	    json['timestamp'] = Date.now()
            db.taxiDensity.insert(json)
	    console.log(json)
            console.log("saved")
        })
    }, null, true, "Asia/Bangkok");
}

getTaxiDensity()
