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

const getSalesByProgram = require('./reports/bySpeciesgroupProg/routes/buildReport')
const drillDownSalesByProgram = require('./reports/bySpeciesgroupProg/routes/buildDrillDown')
const getItemDrillDownForCustomerbySpeciesgroupProg = require('./reports/bySpeciesgroupProg/routes/getItemDrillDownForCustomer') // drilldown level two
const detailSalesByProgram = require('./reports/bySpeciesgroupProg/routes/getDetail')
const drillDownCustomerDetailSalesByProgram = require('./reports/bySpeciesgroupProg/routes/getDetail_inTrendByCust')

const getSalesFrzBrndSize = require('./reports/forProgByFrzBrndSize/routes/buildReport')
const drillDownSalesFrzBrndSize = require('./reports/forProgByFrzBrndSize/routes/buildDrillDown')
const getItemDrillDownForCustomerforProgByFrzBrndSize = require('./reports/forProgByFrzBrndSize/routes/getItemDrillDownForCustomer') // drilldown level two
const detailSalesFrzBrndSize = require('./reports/forProgByFrzBrndSize/routes/getDetail')
const drillDownCustomerDetailSalesFrzBrndSize = require('./reports/forProgByFrzBrndSize/routes/getDetail_inTrendByCust')

const getSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildReport')
const drillDownSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/buildDrillDown')
const getItemDrillDownForCustomerforProgByFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/getItemDrillDownForCustomer') // drilldown level two
const detailSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/getDetail')
const drillDownCustomerDetailSalesFrzSoakSize = require('./reports/forProgByFrzSoakSize/routes/getDetail_inTrendByCust')

const getSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildReport')
const drillDownSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/buildDrillDown')
const getItemDrillDownForCustomerforProgBySpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/getItemDrillDownForCustomer') // drilldown level two
const detailSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/getDetail')
const drillDownCustomerDetailSalesSpecBrndSize = require('./reports/forProgBySpecBrndSize/routes/getDetail_inTrendByCust')

const getSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildReport')
const drillDownSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/buildDrillDown')
const getItemDrillDownForCustomerforProgBySpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/getItemDrillDownForCustomer') // drilldown level two
const detailSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/getDetail')
const drillDownCustomerDetailSalesSpecSoakSize = require('./reports/forProgBySpecSoakSize/routes/getDetail_inTrendByCust')

const glRevCogs = require('./reports/gl/routes/glRevCogs')
const glOthp = require('./reports/gl/routes/glOthp')
const getDrillDownItemDetail = require('./reports/shared/routes/getDetail_inTrendByItem')
const getCustomerDrillDownForItem = require('./reports/shared/routes/viewCustTrend_inTrendByItem')

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

app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.url} route HIT...`)
  next()
})

app.use('/api/sales/baseReport', getSalesByProgram)
app.use('/api/sales/drillDown/bySpeciesgroupProg', drillDownSalesByProgram)
app.use('/api/sales/drillDown/item/bySpeciesgroupProg', getItemDrillDownForCustomerbySpeciesgroupProg) // drilldown level two
app.use('/api/sales/detail/bySpeciesgroupProg', detailSalesByProgram)
app.use('/api/sales/drillDownDetail/customer/bySpeciesgroupProg', drillDownCustomerDetailSalesByProgram)

// app.use('/api/sales/forProgram/byFrzBrndSize', getSalesFrzBrndSize)
app.use('/api/sales/drillDown/forProgByFrzBrndSize', drillDownSalesFrzBrndSize)
app.use('/api/sales/drillDown/item/forProgByFrzBrndSize', getItemDrillDownForCustomerforProgByFrzBrndSize) // drilldown level two
app.use('/api/sales/detail/forProgByFrzBrndSize', detailSalesFrzBrndSize)
app.use('/api/sales/drillDownDetail/customer/forProgByFrzBrndSize', drillDownCustomerDetailSalesFrzBrndSize)

// app.use('/api/sales/forProgram/byFrzSoakSize', getSalesFrzSoakSize)
app.use('/api/sales/drillDown/forProgByFrzSoakSize', drillDownSalesFrzSoakSize)
app.use('/api/sales/drillDown/item/forProgByFrzSoakSize', getItemDrillDownForCustomerforProgByFrzSoakSize) // drilldown level two
app.use('/api/sales/detail/forProgByFrzSoakSize', detailSalesFrzSoakSize)
app.use('/api/sales/drillDownDetail/customer/forProgByFrzSoakSize', drillDownCustomerDetailSalesFrzSoakSize)

// app.use('/api/sales/forProgram/bySpecBrndSize', getSalesSpecBrndSize)
app.use('/api/sales/drillDown/forProgBySpecBrndSize', drillDownSalesSpecBrndSize)
app.use('/api/sales/drillDown/item/forProgBySpecBrndSize', getItemDrillDownForCustomerforProgBySpecBrndSize) // drilldown level two
app.use('/api/sales/detail/forProgBySpecBrndSize', detailSalesSpecBrndSize)
app.use('/api/sales/drillDownDetail/customer/forProgBySpecBrndSize', drillDownCustomerDetailSalesSpecBrndSize)

// app.use('/api/sales/forProgram/bySpecSoakSize', getSalesSpecSoakSize)
app.use('/api/sales/drillDown/forProgBySpecSoakSize', drillDownSalesSpecSoakSize)
app.use('/api/sales/drillDown/item/forProgBySpecSoakSize', getItemDrillDownForCustomerforProgBySpecSoakSize) // drilldown level two
app.use('/api/sales/detail/forProgBySpecSoakSize', detailSalesSpecSoakSize)
app.use('/api/sales/drillDownDetail/customer/forProgBySpecSoakSize', drillDownCustomerDetailSalesSpecSoakSize)

app.use('/api/sales/drillDownDetail/item', getDrillDownItemDetail)
app.use('/api/sales/drillDown/customer', getCustomerDrillDownForItem)

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
