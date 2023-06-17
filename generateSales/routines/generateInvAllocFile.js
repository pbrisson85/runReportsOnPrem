const getFirstDayOfFiscalYear = require('../queries/postgres/getFirstDayOfFiscalYear')
const upsertSalesData = require('../queries/postgres/upsertSalesData')

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

  // Model Data
  const genTblOthp_unflat = unflattenByCompositKey(genTblOthp, { 1: 'OTHP_CODE' })

  // Map Data
  const joinedData = joinInvAllocData(invAllocFile, genTblOthp_unflat)

  // save to new postrgres table
  //const upserted = await upsertInvAllocFile(joinedData)

  return joinedData
}

module.exports = generateSalesDataRoutine
