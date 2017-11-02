const express = require('express');
const bodyParser = require('body-parser');
const db = require ('../database/index.js');
const govData = require ('../helper/gov.js');
const redis = require ('../database/redis.js').client;
const helper = require ('../helper/gov.js');



const statsD = require ('node-statsd');
const statsDClient = new statsD ({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: process.env.HOSTEDGRAPHITE_APIKEY
})

const app = express()
app.use(bodyParser.json());
let port = process.env.PORT || 3000;


//DATE FORMATERS
var createDateBack = function(monthback){
  monthback = monthback * -1;
  var date = new Date(); 
  date.setMonth(date.getMonth() + monthback);
  return date; 
}

var formatDate = function(date){
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  var result =''; 
  result = `${year}-${month}-${day} 00:00:00`
  return result
}



//get for particular z
app.get('/inspectionscore/*', function(req, res) {
  console.log("PARAM", req.query)

  statsDClient.increment('.service.health.query.all')
  //re.query parmaters from client, if none passed , then set to default
  var zip = !req.query.zip ? '94102' : req.query.zip;
  var startDate = !req.query.startDate ? formatDate(createDateBack(3)) : req.query.startDate
  var endDate = !req.query.endDate ? formatDate(new Date()) : req.query.endDate
  var granularity = !granularity ? 'week' : req.query.granularity;

  var start = Date.now();
  var latency;
  //Checking the redis if data exgist for the zip
  redis.get(zip, function(err, reply){

    if(reply === null) {
      console.log("No Cache, please wait");

      //Goes into the database to get the data per req.query
      db.getByZipByGran(zip,startDate, endDate, granularity, function(err, result){
        if(err) {
          console.log("err",err)
          statsDClient.increment('.service.health.query.fail');
          return;
        } else { 

          console.log("Length", result.length);
          var latency = Date.now() - start
          statsDClient.timing('.service.health.query.latency_ms', latency);
          statsDClient.increment('.service.health.query.db');
          res.send(result);
          //console.log('latency', latency);
          redis.set(zip, JSON.stringify(result), 'EX', 60*60 , console.log('OK'));
        }
      })
    } else{

      //has redis cache data to serve to the client 
      var latency = Date.now() - start
      console.log("reply")
      statsDClient.timing('.service.health.query.latency_ms', latency);
      statsDClient.increment('.service.health.query.cache');
      //console.log('latency', latency);
      res.send(reply);
    }
  })
})

// app.get('/', function(req, res) {
//   console.log("PARAM", req.params)
//   var zip = '94102'
//   var start = Date.now();
//   var latency;

//   redis.get(zip, function(err, reply){
//     //console.log("typeOF", reply)
//     if(reply === null) {
//       console.log("No Cache, please wait");
//       db.getlastThreeMonths(zip, function(result){
//         console.log("Length", result.length);
//         res.send(result);
//         var latency = Date.now() - start
//         console.log('latency', latency);
//         redis.set(zip, JSON.stringify(result), 'EX', 300, console.log('OK'));
//         //res.send(JSON.parse(result));
//       })
//     } else{
//       console.log("reply")
//       var latency = Date.now() - start
//       console.log('latency', latency);
//       res.send(reply);
//     }
//   })
// })


// var key = "scott"
// redis.client.set(key, "is here", console.log('OK'));

// redis.client.get(key, function(err, reply) {
//     // reply is null when the key is missing 
//     console.log("cache",key +':'+reply);
// });

// govData.worker1(function(err, result){
//   console.log("success", result);
// });


app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
