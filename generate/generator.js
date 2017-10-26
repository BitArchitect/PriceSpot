var sfZip = ['94102', '94103', '94104', '94105', '94107', 
             '94108', '94109', '94110', '94111', '94112', 
             '94114', '94115', '94116', '94117', '94118', 
             '94121', '94122','94123', '94124', '94127', 
             '94129', '94130', '94131', '94132', '94133',
              '94134', '94158'
            ];

var riskScore = ['Low Risk', 'Moderate Risk', 'High Risk'];

var inspectionType= ['Routine - Unscheduled', 'Complaint', 'Reinspection/Followup', 'New Construction '];

var rand = function(array) {
  return array[Math.floor(Math.random()*array.length)];
}

//randomize year, month, day
var month = pad(Math.floor(Math.random() * 12) + 1);
var year = Math.floor(Math.random() * ((2017-2016)+1) + 2016);
var day = pad(Math.floor(Math.random() * 28) + 1); 

//generates inspection time
var inspectionTime = function(){
  var result; 
  result = year+'-'+month+'-'+day+ ' 00:00:00';
  return result
}

//generate inspection id
var inspectionId = function (){
  return (Math.floor(Math.random()*200)+ 1)+'_'+year+month+day;
}

//add 0 to digits less than 10
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}


var fakeDataGen = function() {
  var obj = {};
  obj['business_postal_code'] = rand(sfZip);
  obj['inspection_id'] = inspectionId();
  obj['inspection_date'] = inspectionTime();
  obj['inspection_type'] = rand(inspectionType);
  obj['risk_category']= rand(riskScore);
  return obj;

}

console.log(inspectionTime());
console.log(inspectionId());
console.log(fakeDataGen());

//console.log(rand(sfZip));

