var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({  
    host: 'localhost:9200'
});

client.ping({
  requestTimeout: 30000,
}, function (error){
  if( error ){
    console.error('elastic search cluster is down');
  }else {
    console.log('All is well');
  }
})