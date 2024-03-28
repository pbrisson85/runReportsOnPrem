const getUniqueOthpGls = require('../helperQueries/getUniqueOthpGls')
const getDataForTempTable = require('../helperQueries/getDataForTempTable')
const createTempTable = require('../helperQueries/createTempTable')
const insertDataToTempTable = require('../helperQueries/insertDataToTempTable')
const unflattenByCompositKeySum = require('../../../../utils/unflattenByCompositKeySum')

const buildOthpGlTempTable = async config => {
  // get all unique othp GL's from sales_contra_lines

  const uniqueOthpGls = await getUniqueOthpGls(config)
  const uniqueOthpGlsArray = uniqueOthpGls.map(gl => gl.othp_gl)

  // build sql that pulls in all sales_contra_lines by invoice with a sum of each othp gl as a col (using if statments regarding the now known unique othp gl's)
  const dataForTempTable = await getDataForTempTable(config, uniqueOthpGlsArray)

  // sum data by invoice number and invoice line
  const tempDataMap = unflattenByCompositKeySum(dataForTempTable, { 1: 'invoice_num', 2: 'invoice_line' })
  const summedTempData = Object.values(tempDataMap)

  // create temp table
  const tempTableName = await createTempTable(config, uniqueOthpGlsArray)

  // write this to a temp table
  await insertDataToTempTable(config, summedTempData, tempTableName)

  return tempTableName
}

module.exports = buildOthpGlTempTable
