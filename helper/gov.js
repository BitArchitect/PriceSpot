const request = require('request');
const bodyParser = require('body-parser');
const db = require ('../database/index.js')
const gen = require ('../generate/generator.js');
const key = process.env.DATA_SF_KEY;
const util = require('../utility/util.js')
////https://data.sfgov.org/resource/sipz-fjte.json?$where=inspection_date > '2017-06-10T12:00:00' AND  inspection_date  < '2017-09-10T12:00:00'

let getRestaurantData = (datewithT, callback) => {

  let options = {
    url: `https://data.sfgov.org/resource/sipz-fjte.json?inspection_date=${datewithT}`,
    type: 'GET',
    qs: {
      '$$app_token': key || 'n4t5ommVtFTmQWxUNTaFfgydB', 
      '$limit': '5000'
    }
  };
    
  request(options, function (error, response, body) {
    if(error) {
      callback(error, null)
    }else {
      body = JSON.parse(body)
      //console.log("BODY",body[0]);
      callback(null,body);
    }
  });
}

let worker1 = async (callback) => {
  console.log("step 1 in worker")
  var datesArray = [];
  var date = new Date();
  
  let result = await db.checkRowCountForDate(util.formatDate(date))
 
 
  var oldestDate = new Date('2014-10-24');
 
    while (+result[0].count === 0 && date >= oldestDate ) {
      console.log("Inside While in worker")
      datesArray.push(formatDate(date));
      date.setDate(date.getDate()-1);
      result = await db.checkRowCountForDate(util.formatDate(date))
    }


    console.log("Days Missing", datesArray);

    datesArray.forEach(function(date) {
      var apiDate = util.formatDateForAPI(date);
      //console.log("APIDATE", apiDate);

      getRestaurantData(apiDate,function(err, result){
        if(err) {
          console.log("err",err)
        } else{
          if(Array.isArray(result) && result.length > 0 ) {
            db.save(result, function(result){ 
              console.log("sucessfull into the database with update to date DATE");
            })
           }
           console.log("please come back at later time");
        }
      })

    })
  
}

module.exports = {
  worker1,
  getRestaurantData
}