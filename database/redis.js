var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("scott", "is here", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);


client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

client.get("scott", function(err, reply) {
    // reply is null when the key is missing 
    console.log(reply);
});



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

