const request = require('request');
const bodyParser = require('body-parser');
const db = require ('../database/index.js')
const gen = require ('../generate/generator.js');
const key = process.env.DATA_SF_KEY;
const util = require('../utility/util.js')

//request to Gov API
let getRestaurantData = (datewithT, callback) => {
  let options = {
    url: `https://data.sfgov.org/resource/sipz-fjte.json?inspection_date=${datewithT}`,
    type: 'GET',
    qs: {
      '$$app_token': key || '', 
      '$limit': '5000'
    }
  };
    
  request(options, function (error, response, body) {
    if(error) {
      callback(error, null)
    }else {
      body = JSON.parse(body)
      callback(null,body);
    }
  });
}

/* Update database on a daily basis. This worker job is to check the Inspection data for dates that are not yet
in our database. 
*/
let worker1 = async (callback) => {
  //gather all dates missing
  var datesArray = [];
  var date = new Date();
  let result = await db.checkRowCountForDate(util.formatDate(date))
 
  var oldestDate = new Date('2014-10-24');
 
  while (+result[0].count === 0 && date >= oldestDate ) {

    datesArray.push(util.formatDate(date));
    date.setDate(date.getDate()-1);
    result = await db.checkRowCountForDate(util.formatDate(date))
  }

  datesArray.forEach(function(date) {
    var apiDate = util.formatDateForAPI(date);
    
    //Get data for missing dates and update database
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
