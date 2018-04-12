const express = require('express');
const bodyParser = require('body-parser');
const db = require ('../database/index.js');
const govData = require ('../helper/gov.js');
const redis = require ('../database/redis.js').client;
const helper = require ('../helper/gov.js');
const util = require ('../utility/util.js')

const statsD = require ('node-statsd');
const statsDClient = new statsD ({
  host: 'statsd.hostedgraphite.com',
  port: 8125,
  prefix: process.env.HOSTEDGRAPHITE_APIKEY
})

const app = express()
app.use(bodyParser.json());
let port = process.env.PORT || 3000;

//Get inpection score for particular zip code, start date, end date, and grandularity. 
//If data is not provided, do a default query with a default zip
//default query is inpection data from last 3 month for zip = 94102

app.get('/inspectionscore/*', function(req, res) {
  
  statsDClient.increment('.service.health.query.all')
  //req.query parmaters from client, if none passed , then set to default
  var zip = !req.query.zip ? '94102' : req.query.zip;
  var startDate = !req.query.startDate ? util.formatDate(util.createDateBack(3)) : req.query.startDate
  var endDate = !req.query.endDate ? util.formatDate(new Date()) : req.query.endDate
  var granularity = !req.query.granularity ? 'week' : req.query.granularity;

  var start = Date.now();
  var latency;

  //Checking the redis if data exist for the zip

  redis.get(JSON.stringify(req.query), function(err, reply){
      if(reply === null) {
        console.log("No Cache, please wait");
        //Goes into the database to get the data per req.query
        db.getByZipByGran(zip,startDate, endDate, granularity, function(err, result){
          if(err) {
            // Log failures for request with stats D, with process time 
            statsDClient.increment('.service.health.query.fail');
            console.log("err",err)
            return;
          } else { 
            //Log successful query to database and send to client-side
            var latency = Date.now() - start
            statsDClient.timing('.service.health.query.latency_ms', latency);
            statsDClient.increment('.service.health.query.db');
            res.send(result);
            //Set data into Redis cache for on hand availability 
            redis.set(JSON.stringify(req.query), JSON.stringify(result), 'EX', 60*60 , console.log('OK'));
          }
        })
      } else{

        //Data exist in Redis Cache and ready to server to the Client 
        var latency = Date.now() - start
        console.log("reply")
        statsDClient.timing('.service.health.query.latency_ms', latency);
        statsDClient.increment('.service.health.query.cache');
        res.send(reply);
      }
    })
  })

//on initial page load serves last three of data for client-side
app.get('/', function(req, res) {
  console.log("PARAM", req.params)
  var zip = '94102'
  var start = Date.now();
  var latency;
  
  //Check if data is available in the Redis Case
  redis.get(zip, function(err, reply){
    
    if(reply === null) {
      console.log("No Cache, please wait");
      db.getlastThreeMonths(zip, function(result){
        console.log("Length", result.length);
        res.send(result);
        var latency = Date.now() - start
        console.log('latency', latency);
        redis.set(zip, JSON.stringify(result), 'EX', 300, console.log('OK'));
        
      })
    } else{
      //Data is available in the Redis Cache to sever to Client
      console.log("reply")
      var latency = Date.now() - start
      console.log('latency', latency);
      res.send(reply);
    }
  })
})


app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
