const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const upsertSalesData = require('../queries/postgres/upsertSalesData')
const getMasterSupplement = require('../queries/postgres/getMasterSupplement')
const getPeriodsByDay = require('../queries/postgres/getAccountingPeriodsByDay')

const getInvoiceLineItems = require('../queries/seasoft/getInvoiceLineItems')
const getGenTblReas = require('../queries/seasoft/getGenTblReas')
const getInvoiceHeader = require('../queries/seasoft/getInvoiceHeader')
const getSalespersonMaster = require('../queries/seasoft/getSalespersonMaster')
const getShipToFile = require('../queries/seasoft/getShipToFile')
const getCustomerMaster = require('../queries/seasoft/getCustomerMaster')

const formatPostgresDateForSeasoftQuery = require('../models/formatPostgresDateForSeasoftQuery')
const unflattenItemNum = require('../models/unFlattenItemNum')
const mapPeriodsPerDay = require('../models/mapPeriodsPerDay')
const joinSalesData = require('../models/joinSalesData')
const unflattenInvoiceNum = require('../models/unFlattenInoviceNum')
const unflattenReasCode = require('../models/unFlattenReasCode')
const mapPostgresSalesLinesTable = require('../models/mapPostgresSalesLinesTable')
const unflattenByCompositeKey = require('../models/unflattenByCompositeKey')

const generateSalesDataRoutine = async year => {
  // pull sales line items from seasoft for the fiscal year

  // Query Data
  let firstDayOfFy = await getFirstDayOfFiscalYear(parseInt(year))
  let firstDayOfNextFy = await getFirstDayOfFiscalYear(parseInt(year) + 1)
  firstDayOfFy = formatPostgresDateForSeasoftQuery(firstDayOfFy)
  firstDayOfNextFy = formatPostgresDateForSeasoftQuery(firstDayOfNextFy)
  const salesLines = await getInvoiceLineItems(firstDayOfFy, firstDayOfNextFy)
  const salesHeader = await getInvoiceHeader(firstDayOfFy, firstDayOfNextFy)
  const invenSupplemental = await getMasterSupplement()
  const periodsByDay = await getPeriodsByDay(parseInt(year))
  const invReasCodes = await getGenTblReas()
  const salespersonMaster = await getSalespersonMaster()
  const shipToFile = await getShipToFile()
  const customerMaster = await getCustomerMaster()

  // Model Data
  const salesHeader_unflat = unflattenInvoiceNum(salesHeader)
  const invenSupplemental_unflat = unflattenItemNum(invenSupplemental)
  const invReasCodes_unflat = unflattenReasCode(invReasCodes)
  const salespersonMaster_unflat = unflattenByCompositeKey(salespersonMaster, {
    1: 'SALESPERSON_CODE',
  })
  const mappedPeriodsPerDay = mapPeriodsPerDay(periodsByDay)
  const shipToFile_unflat = unflattenByCompositeKey(shipToFile, {
    1: 'CUSTOMER_CODE',
    2: 'SHIPTO_CODE',
  })
  const customerMaster_unflat = unflattenByCompositeKey(customerMaster, {
    1: 'CUSTOMER_CODE',
  })

  // Map Data
  const joinedData = joinSalesData(
    salesHeader_unflat,
    salesLines,
    invenSupplemental_unflat,
    mappedPeriodsPerDay,
    invReasCodes_unflat,
    salespersonMaster_unflat,
    shipToFile_unflat,
    customerMaster_unflat
  )
  const mappedData = mapPostgresSalesLinesTable(joinedData)

  // save to new postrgres table
  const upserted = await upsertSalesData(mappedData)

  return mappedData
}

module.exports = generateSalesDataRoutine
