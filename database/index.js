const { Client } = require('pg')
const connectionString = 'postgresql://localhost:5432/test'

const client = new Client({
  connectionString: connectionString,
})
client.connect()


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
        callback(err, null)
      } else {
        callback("success into database")
      }
    })
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

var getlastThreeMonths = function (callback) {
  var query = `SELECT * from restaurantscore where inspection_date >  CURRENT_DATE - INTERVAL '3 months'`
  client.query(query, function(err, res){
      if(err){
        callback(err, null)
      } else {
        callback(res.rows);
      }
    })
}

module.exports = {
  client: client,
  save,
  getlastThreeMonths
}

