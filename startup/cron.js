const CronJob = require('cron').CronJob
const runShipToTests = require('../generateSales/tests/testShipToCountryState')

// define cron jobs
const runTests = new CronJob('*/20 * * * *', () => runShipToTests(), null, false, 'America/New_York') // update every 10 minutes

// add cron.start() here to run the job on app startup
const runCronOnStartup = () => {
  runTests.start()
}

module.exports.runCronOnStartup = runCronOnStartup
