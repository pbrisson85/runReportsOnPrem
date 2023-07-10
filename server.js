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
const detailSalesByProgram = require('./reports/bySpeciesgroupProg/routes/getDetail')
const getSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildReport')
const drillDownSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildDrillDown')
const detailSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/getDetail')
const getSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildReport')
const drillDownSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildDrillDown')
const detailSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/getDetail')
const getSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildReport')
const drillDownSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildDrillDown')
const detailSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/getDetail')
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')
const getDrillDownItemDetail = require('./reports/shared/routes/getDrillDownItemDetail')

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
app.use('/api/sales/drillDownDetail/item', getDrillDownItemDetail)
app.use('/api/sales/bySpeciesgroupProg', getSalesByProgram)
app.use('/api/sales/drillDown/bySpeciesgroupProg', drillDownSalesByProgram)
app.use('/api/sales/detail/bySpeciesgroupProg', detailSalesByProgram)
app.use('/api/sales/forProgram/byFrzSoakSize', getSalesFrzSoakSize)
app.use('/api/sales/drillDown/forProgByFrzSoakSize', drillDownSalesFrzSoakSize)
app.use('/api/sales/detail/forProgByFrzSoakSize', detailSalesFrzSoakSize)
app.use('/api/sales/forProgram/bySpecBrndSize', getSalesSpecBrndSize)
app.use('/api/sales/drillDown/forProgBySpecBrndSize', drillDownSalesSpecBrndSize)
app.use('/api/sales/detail/forProgBySpecBrndSize', detailSalesSpecBrndSize)
app.use('/api/sales/forProgram/bySpecSoakSize', getSalesSpecSoakSize)
app.use('/api/sales/drillDown/forProgBySpecSoakSize', drillDownSalesSpecSoakSize)
app.use('/api/sales/detail/forProgBySpecSoakSize', detailSalesSpecSoakSize)
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
