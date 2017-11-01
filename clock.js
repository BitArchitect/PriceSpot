var CronJob = require('cron').CronJob;
var gov = require('./helper/gov.js');
var gen = require('./generate/generator.js')


new CronJob(
  '00 00 00 * * 7', 
  function() {
    gov.worker1();
    console.log('worker is starting');
  },
  function() {
    console.log("worker is finish");
  }, 
  true, 
  'America/Los_Angeles');