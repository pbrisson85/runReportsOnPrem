// initialize environment variables
require('dotenv').config()

// initialize express server
const express = require('express')
const app = express()
const helmet = require('helmet')

// initialize routes
/* Reports */
const getSalesByProgram = require('./reports/bySpeciesgroupProg/routes/buildReport')
const drillDownSalesByProgram = require('./reports/bySpeciesgroupProg/routes/buildDrillDown')
const getSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildReport')
const drillDownSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildDrillDown')
const getSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildReport')
const drillDownSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildDrillDown')
const getSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildReport')
const drillDownSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildDrillDown')
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')

/* Data */
const generateSalesData = require('./generateSales/routes/generateSales')
const generateInvAllocFile = require('./generateSales/routes/generateInvAllocFile')

/* UI */
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
app.use('/api/sales/bySpeciesgroupProg', getSalesByProgram)
app.use('/api/sales/drillDown/bySpeciesgroupProg', drillDownSalesByProgram)
app.use('/api/sales/forProgram/byFrzSoakSize', getSalesFrzSoakSize)
app.use('/api/sales/drillDown/byFrzSoakSize', drillDownSalesFrzSoakSize)
app.use('/api/sales/forProgram/bySpecBrndSize', getSalesSpecBrndSize)
app.use('/api/sales/drillDown/bySpecBrndSize', drillDownSalesSpecBrndSize)
app.use('/api/sales/forProgram/bySpecSoakSize', getSalesSpecSoakSize)
app.use('/api/sales/drillDown/bySpecSoakSize', drillDownSalesSpecSoakSize)
app.use('/api/sales/generateSalesData', generateSalesData)
app.use('/api/sales/generateInvAllocData', generateInvAllocFile)
app.use('/api/sales/getFilters', getFilters)
app.use('/api/sales/gl/revCogs', glRevCogs)
app.use('/api/sales/gl/othp', glOthp)

// startup
runCronOnStartup()

// start express server
const PORT = process.env.runPurchases_PORT || 5037
app.listen(PORT, () => console.log(`runPurchasesOnPrem running on port ${PORT} \n`))
