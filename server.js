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
// Sales
const baseReport_sales = require('./reports/sales/routes/baseReport')
const viewTrend_sales = require('./reports/sales/routes/viewTrend')
const getDetail_baseReport_sales = require('./reports/sales/routes/getDetail')
const getFilters_sales = require('./reports/sales/routes/getFilters')

// GL
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')

// Inventory
const baseReport_inven = require('./reports/inven/routes/baseReport')
const viewTrend_inven = require('./reports/inven/routes/viewTrend')
const getDetail_baseReport_inven = require('./reports/inven/routes/getDetail')
const getFilters_inven = require('./reports/inven/routes/getFilters')

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
  //console.log(`\n${req.method} ${req.url}`)
  //req.method === 'POST' && console.log(`${JSON.stringify(req.body)}`)
  next()
})

app.use('/api/reports/sales/baseReport', baseReport_sales)
app.use('/api/reports/sales/drillDown', viewTrend_sales)
app.use('/api/reports/sales/detail', getDetail_baseReport_sales)
app.use('/api/reports/sales/getFilters', getFilters_sales)

app.use('/api/reports/inven/baseReport', baseReport_inven)
app.use('/api/reports/inven/drillDown', viewTrend_inven)
app.use('/api/reports/inven/detail', getDetail_baseReport_inven)
app.use('/api/reports/inven/getFilters', getFilters_inven)

app.use('/api/reports/gl/revCogs', glRevCogs)
app.use('/api/reports/gl/othp', glOthp)

// start express server
const PORT = process.env.runReporting_PORT || 5037
app.listen(PORT, () => console.log(`runReportsOnPrem running on port ${PORT} \n`))
