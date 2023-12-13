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
const baseReport = require('./reports/sales/routes/baseReport')
const viewTrend = require('./reports/sales/routes/viewTrend')
const getDetail_baseReport = require('./reports/sales/routes/getDetail')
const getFilters = require('./reports/sales/routes/getFilters')

// GL
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')

// Inventory
const baseReport = require('./reports/inven/routes/baseReport')
const viewTrend = require('./reports/inven/routes/viewTrend')
const getDetail_baseReport = require('./reports/inven/routes/getDetail')
const getFilters = require('./reports/inven/routes/getFilters')

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

app.use('/api/reports/sales/baseReport', baseReport)
app.use('/api/reports/sales/drillDown', viewTrend)
app.use('/api/reports/sales/detail', getDetail_baseReport)
app.use('/api/reports/sales/getFilters', getFilters)

app.use('/api/reports/inven/baseReport', baseReport)
app.use('/api/reports/inven/drillDown', viewTrend)
app.use('/api/reports/inven/detail', getDetail_baseReport)
app.use('/api/reports/inven/getFilters', getFilters)

app.use('/api/reports/gl/revCogs', glRevCogs)
app.use('/api/reports/gl/othp', glOthp)

// start express server
const PORT = process.env.runReporting_PORT || 5037
app.listen(PORT, () => console.log(`runReportsOnPrem running on port ${PORT} \n`))
