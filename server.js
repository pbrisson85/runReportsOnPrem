// initialize environment variables
require('dotenv').config()

// initialize express server
const express = require('express')
const app = express()
const helmet = require('helmet')

// initialize routes
const getSalesByProgram = require('./reports/bySpeciesgroupProg/routes/getWklyReport')
const getSalesFrzSoakSize = require('./reports/forProgFrzSoakSize/routes/getWklyReport')
const generateSalesData = require('./generateSales/routes/generateSales')
const getFilters = require('./reports/filters/routes/getFilters')

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
app.use('/api/sales/byProgram', getSalesByProgram)
app.use('/api/sales/forProgramFfpds', getSalesFrzSoakSize)
app.use('/api/sales/generateSalesData', generateSalesData)
app.use('/api/sales/getFilters', getFilters)

// startup
runCronOnStartup()

// start express server
const PORT = process.env.runPurchases_PORT || 5037
app.listen(PORT, () => console.log(`runPurchasesOnPrem running on port ${PORT} \n`))
