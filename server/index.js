const express = require('express')
const bodyParser = require('body-parser')
const db = require ('../database/index.js')
const govData = require ('../helper/gov.js')
const redis = require ('../database/redis.js')
const helper = require ('../helper/gov.js')


const app = express()
app.use(bodyParser.json());

// app.get('/write', function(req, res) {
//   govData.getRestaurantData(function(result){
//     db.processData(result, function( result) {
//         console.log("successfull import the data to db");
//     })
//   })
// })

app.get('/', function(req, res) {
  db.getlastThreeMonths(function(result){
    console.log("last three months", result);
    redis.set(`r`)
  })
})
// app.get('/read', function(req, res) {
//   redis.getInspectionData("", (err) => {

//   })
// })



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
