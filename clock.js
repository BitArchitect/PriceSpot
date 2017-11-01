var CronJob = require('cron').CronJob;
var gov = require('./helper/gov.js');
var gen = require('./generate/generator.js')


// gov.worker1();

var job = new CronJob({
  cronTime: '00 00 00 * * 7', 
  onTick: gov.worker1,
  start: true, 
  timeZone: 'America/Los_Angeles'
});

job.start()
console.log('fire instance clock job status', job.running);