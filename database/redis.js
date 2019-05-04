var redis = require("redis"),
    client = redis.createClient(process.env.REDISTOGO_URL);
// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });
client.on("error", function (err) {
    console.log("Error " + err);
});

// var key = "scott"
// client.set(key, "is here", redis.print);

// client.get(key, function(err, reply) {
//     // reply is null when the key is missing 
//     console.log("cache",key +':'+reply);
// });


var getInscpectionData = function (zip, callback) {
  client.get(query, (err, result) => {
    if(err) {
      console.log("Error", err) 
      callback(err, null);
    } 
    if(result){
      callback(null, JSON.parse(result));
    }
    callback(null, []);
  })
}

module.exports = {
  client,
}

