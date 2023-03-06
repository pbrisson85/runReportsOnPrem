const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const formatPostgresDateForSeasoftQuery = require('../models/formatPostgresDateForSeasoftQuery')
const getInvoiceLineItems = require('../queries/seasoft/getInvoiceLineItems')
const getMasterSupplement = require('../queries/postgres/getMasterSupplement')
const unflattenItemNum = require('../models/unFlattenItemNum')
const mapPeriodsPerDay = require('../models/mapPeriodsPerDay')
const getPeriodsByDay = require('../queries/postgres/getAccountingPeriodsByDay')
const joinSalesData = require('../models/joinSalesData')
const getInvoiceHeader = require('../queries/seasoft/getInvoiceHeader')
const unflattenInvoiceNum = require('../models/unFlattenInoviceNum')
const getGenTblReas = require('../queries/seasoft/getGenTblReas')
const unflattenReasCode = require('../models/unFlattenReasCode')
const mapPostgresSalesLinesTable = require('../models/mapPostgresSalesLinesTable')

const generateSalesDataRoutine = async year => {
  console.log('generate detail sales data...')

  // pull sales line items from seasoft for the fiscal year

  // Query Data
  let firstDayOfFy = await getFirstDayOfFiscalYear(parseInt(year))
  let firstDayOfNextFy = await getFirstDayOfFiscalYear(parseInt(year) + 1)
  firstDayOfFy = formatPostgresDateForSeasoftQuery(firstDayOfFy[0].date)
  firstDayOfNextFy = formatPostgresDateForSeasoftQuery(firstDayOfNextFy[0].date)
  const salesLines = await getInvoiceLineItems(firstDayOfFy, firstDayOfNextFy)
  const salesHeader = await getInvoiceHeader(firstDayOfFy, firstDayOfNextFy)
  const invenSupplemental = await getMasterSupplement()
  const periodsByDay = await getPeriodsByDay(parseInt(year))
  const invReasCodes = await getGenTblReas()

  // Model Data
  const salesHeader_unflat = unflattenInvoiceNum(salesHeader)
  const invenSupplemental_unflat = unflattenItemNum(invenSupplemental)
  const invReasCodes_unflat = unflattenReasCode(invReasCodes)
  const mappedPeriodsPerDay = mapPeriodsPerDay(periodsByDay)

  // Map Data
  const joinedData = joinSalesData(salesHeader_unflat, salesLines, invenSupplemental_unflat, mappedPeriodsPerDay, invReasCodes_unflat)

  const mappedData = mapPostgresSalesLinesTable(joinedData)

  // add all supplemental inven data to the sales line items

  // save to new postrgres table

  // routes will query this data for the front end and query on order at same time and format live

  return mappedData
}

module.exports = generateSalesDataRoutine
