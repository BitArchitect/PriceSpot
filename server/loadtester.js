var request = require ('request');

setInterval(()=>{
  request('https://resturantscores.herokuapp.com/inspectionscore/', (err, res, body)=>{
    if(err) {
      return console.log("err, loadtest");
    } else {
      console.log(body);
    }
  })
},20);