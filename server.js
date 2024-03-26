// initialize environment variables
require('dotenv').config()

// initialize express server
const express = require('express')
const app = express()
const helmet = require('helmet')

// initialize postgres js
const postgres = require('postgres')
const sql = postgres({
  connection: {
    application_name: 'run_reports_on_prem',
  },
  max: 75,
})
module.exports = sql

// initialize routes
/* Reports */

// Cash PO (projection)
const baseReport_cashPo = require('./reports/cash_po/routes/baseReport')
const getDetail_cashPo = require('./reports/cash_po/routes/getDetail')

// Sales
const baseReport_sales = require('./reports/sales/routes/baseReport')
const rowSlice_sales = require('./reports/sales/routes/rowSlice')
const getDetail_sales = require('./reports/sales/routes/getDetail')

// GL
const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')

// Inventory
const baseReport_inven = require('./reports/inven/routes/baseReport')
const rowSlice_inven = require('./reports/inven/routes/rowSlice')
const getDetail_inven = require('./reports/inven/routes/getDetail')

// Production
const baseReport_production = require('./reports/production/routes/baseReport')
const rowSlice_production = require('./reports/production/routes/rowSlice')
const getDetail_production = require('./reports/production/routes/getDetail')

// Filters
const getFilters = require('./reports/filters/routes/getFilters')

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

app.use('/api/reports/cashPo/baseReport', baseReport_cashPo)
app.use('/api/reports/cashPo/detail', getDetail_cashPo)

app.use('/api/reports/sales/baseReport', baseReport_sales)
app.use('/api/reports/sales/rowSlice', rowSlice_sales)
app.use('/api/reports/sales/detail', getDetail_sales)

app.use('/api/reports/inven/baseReport', baseReport_inven)
app.use('/api/reports/inven/rowSlice', rowSlice_inven)
app.use('/api/reports/inven/detail', getDetail_inven)

app.use('/api/reports/production/baseReport', baseReport_production)
app.use('/api/reports/production/rowSlice', rowSlice_production)
app.use('/api/reports/production/detail', getDetail_production)

app.use('/api/reports/getFilters', getFilters)

app.use('/api/reports/gl/revCogs', glRevCogs)
app.use('/api/reports/gl/othp', glOthp)

// start express server
const PORT = process.env.runReporting_PORT || 5037
app.listen(PORT, () => console.log(`runReportsOnPrem running on port ${PORT} \n`))
