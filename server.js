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
const baseReport = require('./reports/sales/routes/baseReport')
const viewTrend = require('./reports/sales/routes/viewTrend')
const getDetail_baseReport = require('./reports/sales/routes/getDetail')
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')
const runTests = require('./generateSales/routes/manualTests')

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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  req.body && console.log(`${JSON.stringify(req.body)}`)
  next()
})

app.use('/api/sales/runTests', runTests)
app.use('/api/sales/baseReport', baseReport)
app.use('/api/sales/drillDown', viewTrend)
app.use('/api/sales/detail', getDetail_baseReport)

app.use('/api/sales/generateSalesData', generateSalesData)
app.use('/api/sales/generateInvAllocData', generateInvAllocFile)
app.use('/api/sales/getFilters', getFilters)
app.use('/api/sales/gl/revCogs', glRevCogs)
app.use('/api/sales/gl/othp', glOthp)

// startup
runCronOnStartup()

// start express server
const PORT = process.env.runSales_PORT || 5037
app.listen(PORT, () => console.log(`runSalesOnPrem running on port ${PORT} \n`))
