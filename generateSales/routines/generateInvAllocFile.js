const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const upsertInvAllocFile = require('../queries/postgres/upsertInvAllocFile')
const getDeletedOthp = require('../queries/postgres/getDeletedOthp')

const getGenTblOthp = require('../queries/seasoft/getGenTblOthp')
const getInvAllocFile = require('../queries/seasoft/getInvAllocFile')

const formatPostgresDateForSeasoftQuery = require('../models/formatPostgresDateForSeasoftQuery')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')
const joinInvAllocData = require('../models/joinInvAllocData')

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
  const deletedOthp = await getDeletedOthp()

  // Model Data
  const genTblOthp_unflat = unflattenByCompositKey(genTblOthp, { 1: 'OTHP_CODE' })
  const deletedOthp_unflat = unflattenByCompositKey(deletedOthp, { 1: 'othp_code' })

  // Map Data
  const joinedData = joinInvAllocData(invAllocFile, genTblOthp_unflat, deletedOthp_unflat)

  // Model Data
  const data_unflat = unflattenByCompositKey(joinedData, { 1: 'INVOICE_NUMBER', 2: 'INVOICE_LINE_NUMBER', 3: 'EXPENSE_CODE' })

  // Note that there are multiple instances of invoice alloc file for each invoice-line-othp code. Need to sum on this field.

  // save to new postrgres table
  const upserted = await upsertInvAllocFile(data_unflat)

  return joinedData
}

module.exports = generateSalesDataRoutine
