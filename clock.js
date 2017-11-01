var CronJob = require('cron').CronJob;
var gov = require('./helper/gov.js');
var gen = require('./generate/generator.js')


// gov.worker1();

var job = new CronJob(
  '00 00 00 * * 7', 
  function() {
    console.log('worker is starting');
    gov.worker1();
  },
  function() {
    console.log("worker is finish");
  }, 
  true, 
  'America/Los_Angeles');

job.start()
console.log('fire instance clock job status', job.running);