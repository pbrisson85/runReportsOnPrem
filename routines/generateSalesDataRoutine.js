const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const formatPostgresDateForSeasoftQuery = require('../models/formatPostgresDateForSeasoftQuery')
const getInvoiceLineItems = require('../queries/seasoft/getInvoiceLineItems')
const getMasterSupplement = require('../queries/postgres/getMasterSupplement')
const unflattenItemNum = require('../models/unFlattenItemNum')
const mapPeriodsPerDay = require('../models/mapPeriodsPerDay')

const generateSalesDataRoutine = async year => {
  console.log('generate detail sales data...')

  // pull sales line items from seasoft for the fiscal year

  // Query Data
  let firstDayOfFy = await getFirstDayOfFiscalYear(parseInt(year))
  let firstDayOfNextFy = await getFirstDayOfFiscalYear(parseInt(year) + 1)
  firstDayOfFy = formatPostgresDateForSeasoftQuery(firstDayOfFy[0].date)
  firstDayOfNextFy = formatPostgresDateForSeasoftQuery(firstDayOfNextFy[0].date)
  const sales = await getInvoiceLineItems(firstDayOfFy, firstDayOfNextFy)
  const invenSupplemental = await getMasterSupplement()
  const periodsByDay = await getPeriodsByDay(parseInt(year))

  // Model Data
  const invenSupplemental_unflat = unflattenItemNum(invenSupplemental)
  const mappedPeriodsPerDay = mapPeriodsPerDay(periodsByDay)

  // Map Data
  const mappedSales = mapAllInvoices(sales, invenSupplemental_unflat, mappedPeriodsPerDay)

  // add all supplemental inven data to the sales line items

  // save to new postrgres table

  // routes will query this data for the front end and query on order at same time and format live

  return mappedSales
}

module.exports = generateSalesDataRoutine
