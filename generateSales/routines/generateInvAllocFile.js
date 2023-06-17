const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const upsertSalesData = require('../queries/postgres/upsertSalesData')
const getMasterSupplement = require('../queries/postgres/getMasterSupplement')
const getPeriodsByDay = require('../queries/postgres/getAccountingPeriodsByDay')

const getGenTblOthp = require('../queries/seasoft/getGenTblOthp')
const getInvAllocFile = require('../queries/seasoft/getInvAllocFile')

const formatPostgresDateForSeasoftQuery = require('../models/formatPostgresDateForSeasoftQuery')
const unflattenItemNum = require('../models/unFlattenItemNum')
const mapPeriodsPerDay = require('../models/mapPeriodsPerDay')
const joinSalesData = require('../models/joinSalesData')
const unflattenInvoiceNum = require('../models/unFlattenInoviceNum')
const unflattenReasCode = require('../models/unFlattenReasCode')
const mapPostgresSalesLinesTable = require('../models/mapPostgresSalesLinesTable')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')

const generateSalesDataRoutine = async year => {
  console.log('generate detail sales data...')

  // pull sales line items from seasoft for the fiscal year

  // Query Data
  let firstDayOfFy = await getFirstDayOfFiscalYear(parseInt(year))
  let firstDayOfNextFy = await getFirstDayOfFiscalYear(parseInt(year) + 1)
  firstDayOfFy = formatPostgresDateForSeasoftQuery(firstDayOfFy)
  firstDayOfNextFy = formatPostgresDateForSeasoftQuery(firstDayOfNextFy)
  const invAllocFile = await getInvAllocFile(firstDayOfFy, firstDayOfNextFy)
  const genTblOthp = await getGenTblOthp()

  // Model Data
  const genTblOthp_unflat = unflattenByCompositKey(genTblOthp, { 1: 'OTHP_CODE' })
  const invAllocFile_unflat = unflattenByCompositKey(invAllocFile, { 1: 'INVOICE_NUMBER', 2: 'INVOICE_LINE_NUMBER', 3: 'EXPENSE_CODE' })

  return { genTblOthp_unflat, invAllocFile_unflat }

  const salesHeader_unflat = unflattenInvoiceNum(salesHeader)
  const invenSupplemental_unflat = unflattenItemNum(invenSupplemental)
  const invReasCodes_unflat = unflattenReasCode(invReasCodes)
  const mappedPeriodsPerDay = mapPeriodsPerDay(periodsByDay)

  // Map Data
  const joinedData = joinSalesData(salesHeader_unflat, salesLines, invenSupplemental_unflat, mappedPeriodsPerDay, invReasCodes_unflat)
  const mappedData = mapPostgresSalesLinesTable(joinedData)

  // save to new postrgres table
  const upserted = await upsertSalesData(mappedData)

  return mappedData
}

module.exports = generateSalesDataRoutine
