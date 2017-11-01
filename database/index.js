const pg = require('pg')
const pgp = require('pg-promise')();

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/test';
const clientPromise = pgp(process.env.DATABASE_URL || 'postgresql://localhost:5432/test');


const client = new pg.Client({
  connectionString: connectionString,
})
client.connect()




var checkRowCountForDate = function (date, callback){
  var query = `SELECT count(*) FROM restaurantscore WHERE inspection_date = '${date}'`;
  return clientPromise.query(query)
  .then(data => {
    return data;
  })
  .catch(err => {
    console.log("eer", err);
  })   
}

var save = function(result, callback) {
  result.map((entry) => { 
    var zip = entry.business_postal_code;
    var inspectionId = entry.inspection_id;
    var inspectionDate = entry.inspection_date.includes('T') ? changeDate(entry.inspection_date) : entry.inspection_date;
    var inspectionType = entry.inspection_type;
    var risk = entry.risk_category;
    //console.log("risk", risk);

    var query = `INSERT INTO restaurantscore (
                    business_zip,
                    inspection_id,
                    inspection_date,
                    inspection_type,
                    risk_category
                   ) 
                  VALUES 
                    ($1,$2,$3,$4,$5)

                    `
    client.query(query,[zip,inspectionId,inspectionDate, inspectionType, risk], function(err, res){
      if(err){
        console.log("errhhh", err)
        callback(err, null)
      } else {
        callback("success into database")
      }
    })
  })
}


// var save = function(result, callback) {
//   result.map((entry) => { 
//     console.log("ENTRY", entry);
//     var zip = entry.business_postal_code;
//     var inspectionId = entry.inspection_id;
//     var inspectionDate = entry.inspection_date.includes('T') ? changeDate(entry.inspection_date) : entry.inspection_date;
//     var inspectionType = entry.inspection_type;
//     var risk = entry.risk_category;
//     //console.log("risk", risk);

//     var query = `INSERT INTO restaurantscore (
//                     business_zip,
//                     inspection_id,
//                     inspection_date,
//                     inspection_type,
//                     risk_category
//                    ) 
//                   VALUES 
//                     ($1,$2,$3,$4,$5)

//                     `
//     client.query(query,[zip,inspectionId,inspectionDate, inspectionType, risk], function(err, res){
//       if(err){
//         console.log("errhhh", err)
//         callback(err, null)
//       } else {
//         callback("success into database")
//       }
//     })
//   })
// }


var saveSingle = function(entry, callback) {
    var zip = entry.business_postal_code;
    var inspectionId = entry.inspection_id;
    var inspectionDate = entry.inspection_date.includes('T') ? changeDate(entry.inspection_date) : entry.inspection_date;
    var inspectionType = entry.inspection_type;
    var risk = entry.risk_category;
    var query = `INSERT INTO restaurantscore (
                    business_zip,
                    inspection_id,
                    inspection_date,
                    inspection_type,
                    risk_category
                   ) 
                  VALUES 
                    ($1,$2,$3,$4,$5)

                    `
    client.query(query,[zip,inspectionId,inspectionDate, inspectionType, risk], function(err, res){
      if(err){
        callback(err, null)
      } else {
        callback("success into database")
      }
    })
}
//changes the inspection date to correct formate '2017-09-26 00:00:00' from '2017-09-26T00:00:00.000'
var changeDate = function(string){
  var chars = string.split("");
  var letter = "T"
  chars.splice(chars.indexOf(letter),1," ");
  chars.splice(-4,chars.length);
  return chars.join("");
}

// var getByZip = function(zip, callback) {
//   var query = `select (*) from restaurantscore where business_zip = '${zip}'`;
//   client.query(query, function (err, res) {
//     if(err){
//       callback(err, null)
//     }else {
//       // console.log("ghgjgjgjgjg",res)
//       callback(res.rows)
//     }
//   })
// }

var getByZipByGran = function(zip, startDate, endDate, granularity, callback) {
  var query = 
  `select date_trunc('${granularity}', inspection_date) as ${granularity},
       sum((risk_category = 'High Risk')::int) as High,
       sum((risk_category = 'Moderate Risk')::int) as moderate,
       sum((risk_category = 'Low Risk')::int) as Low

  from restaurantscore
  where business_zip = '${zip}' and inspection_date > '${startDate}' and inspection_date < '${endDate}'
  group by ${granularity}
  order by ${granularity};`;
  client.query(query, function (err, res) {
    if(err){
      console.log("THIS ERROR", err);
      console.log('theis was the query', query);
      callback(err)

    }else {
      callback(res.rows)
    }
  })
}

var getlastThreeMonths = function (zip, callback) {
  var query = 
  `SELECT business_zip, 
       sum(case when risk_category = 'High Risk' then 1 else 0 end) as HighRiskInspections,
       sum(case when  risk_category = 'Moderate Risk'  then 1 else 0 end) as ModerateRiskInpections,
       sum(case when  risk_category = 'Low Risk' then 1 else 0 end) as LowRiskInspections
  from restaurantscore 
  group by business_zip`

  client.query(query, function(err, res){
      if(err){
        callback(err, null)
      } else {
        console.log("heeee", res.rows)
        callback(res.rows);
      }
    })
}



module.exports = {
  client: client,
  save,
  saveSingle,
  getlastThreeMonths,
  // getByZip,
  getByZipByGran,
  checkRowCountForDate
}

