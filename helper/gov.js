const request = require('request');
const bodyParser = require('body-parser');
const db = require ('../database/index.js')
const gen = require ('../generate/generator.js');
const key = process.env.DATA_SF_KEY;
////https://data.sfgov.org/resource/sipz-fjte.json?$where=inspection_date > '2017-06-10T12:00:00' AND  inspection_date  < '2017-09-10T12:00:00'
var formatDate = function(date){
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  var result =''; 
  result = `${year}-${month < 10 ? '0'+ month : month }-${day < 10? '0'+day: day} 00:00:00`
  return result
}

var formatDateForAPI = function(datewithoutT){
  var str = datewithoutT.split('');
  str.splice(10,1,'T');
  return str.join('');
}

let getRestaurantData = (datewithT, callback) => {

  let options = {
    url: `https://data.sfgov.org/resource/sipz-fjte.json?inspection_date=${datewithT}`,
    type: 'GET',
    qs: {
      '$$app_token': key, 
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

let worker1 = async function(callback){

  var datesArray = [];
  var date = new Date();
  
  let result = await db.checkRowCountForDate(formatDate(date))
 
 
  var oldestDate = new Date('2014-01-01');
 
    while (+result[0].count === 0 && date >= oldestDate ) {

      datesArray.push(formatDate(date));
      date.setDate(date.getDate()-1);
      result = await db.checkRowCountForDate(formatDate(date))
    }


    console.log("Days Missing", datesArray);

    datesArray.forEach(function(date) {
      var apiDate = formatDateForAPI(date);
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
console.log(formatDateForAPI('2017-10-29 00:00:00'));
module.exports = {
  worker1,
  getRestaurantData
}