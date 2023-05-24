// initialize environment variables
require('dotenv').config()

// initialize express server
const express = require('express')
const app = express()
const helmet = require('helmet')

// initialize routes
const getSalesByProcLevel = require('./routes/getWklyReportByProcLevel')
const getSalesByProgram = require('./routes/getWklyReportByProgram')
const generateSalesData = require('./routes/generateSalesDataRoute')
const getFilters = require('./routes/getFilters')

// initialize startup procedures
const { runCronOnStartup } = require('./startup/cron')

// error handling
process.on('uncaughtException', ex => {
  console.error(ex)
  console.log('exiting app')
  process.exit(1)
})

process.on('unhandledRejection', ex => {
  console.error(ex)
  console.log('exiting app')
  process.exit(1)
})

// routes
app.use(helmet())
app.use(express.json())
app.use('/api/sales/byProcLevel', getSalesByProcLevel)
app.use('/api/sales/byProgram', getSalesByProgram)
app.use('/api/sales/generateSalesData', generateSalesData)
app.use('/api/sales/getFilters', getFilters)

// startup
runCronOnStartup()

// start express server
const PORT = process.env.runPurchases_PORT || 5037
app.listen(PORT, () => console.log(`runPurchasesOnPrem running on port ${PORT} \n`))
