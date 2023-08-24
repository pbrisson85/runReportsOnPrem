// initialize environment variables
require('dotenv').config()

// initialize express server
const express = require('express')
const app = express()
const helmet = require('helmet')

// initialize postgres js
const postgres = require('postgres')
const sql = postgres()
module.exports = sql

// initialize routes
/* Reports */

const test = require('./test')

const baseReport = require('./reports/sales/routes/baseReport')
const viewTrend = require('./reports/sales/routes/viewTrend')
const viewItemTrend_inTrendByCust = require('./reports/sales/routes/viewItemTrend_inTrendByCust')
const getDetail_baseReport = require('./reports/sales/routes/getDetail_baseReport')
const getDetail_inTrendByCust = require('./reports/sales/routes/getDetail_inTrendByCust')
const getDetail_inTrendByItem = require('./reports/sales/routes/getDetail_inTrendByItem')
const viewCustTrend_inTrendByItem = require('./reports/sales/routes/viewCustTrend_inTrendByItem')
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

app.use('/api/sales/test', test)

app.use('/api/sales/baseReport', baseReport)
app.use('/api/sales/drillDown', viewTrend)
app.use('/api/sales/drillDown/item', viewItemTrend_inTrendByCust) // drilldown level two
app.use('/api/sales/detail', getDetail_baseReport)
app.use('/api/sales/drillDownDetail/customer', getDetail_inTrendByCust)
app.use('/api/sales/drillDownDetail/item', getDetail_inTrendByItem)
app.use('/api/sales/drillDown/customer', viewCustTrend_inTrendByItem)

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
