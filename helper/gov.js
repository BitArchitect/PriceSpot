const request = require('request');
const bodyParser = require('body-parser');
const db = require ('../database/index.js')

let getRestaurantData = (callback) => {

  let options = {
    url: `https://data.sfgov.org/resource/sipz-fjte.json`,
    headers: {
      'app_tocket': '', 
      'contentType': 'application/json',
    }
  };
    
  request(options, function (error, response, body) {
    body = JSON.parse(body)
    // console.log(body[0]);
    callback(body);
  });
}

let worker1 = function(callback){
  getRestaurantData(function(result){
    db.save(result, function(result){ 
      console.log(result);
    })
  })
}




module.exports = {
  worker1,
  getRestaurantData
}