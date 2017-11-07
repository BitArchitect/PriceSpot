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
  result = `${year}-${month < 10 ? '0'+ month : month }-${day < 10? '0'+day: day} 00:00:00`
  return result
}

var formatDateForAPI = function(datewithoutT){
  var str = datewithoutT.split('');
  str.splice(10,1,'T');
  return str.join('');
}


module.exports = {
  createDateBack,
  formatDateForAPI,
  formatDateForAPI
}