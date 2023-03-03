const CronJob = require('cron').CronJob

// define cron jobs
//const runUpdatePerpetual = new CronJob('*/2 * * * *', () => updatePerpetual(), null, false, 'America/New_York') // update every 10 minutes

// add cron.start() here to run the job on app startup
const runCronOnStartup = () => {
  //runUpdatePerpetual.start()
}

module.exports.runCronOnStartup = runCronOnStartup
