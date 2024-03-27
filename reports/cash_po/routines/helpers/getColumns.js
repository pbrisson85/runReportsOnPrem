const apCols = require('../../data/baseCols/apCols')
const totalCol = require('../../data/baseCols/totalCol')
const poCols = require('../../data/baseCols/purchaseOrderCols')
const unvouchCols = require('../../data/baseCols/unvouchCols')
const trendColsTemplate = require('../../data/baseCols/trendColsTemplate')
const getTrendColsPoCash = require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsPoCash').getTrendColsPoCash

// These are configs for the columns in the report
const getColumns = async (config, colDataNames) => {
  // Note that colDataNames are passed in as a standard practice to use in stripping away any columns that are not requested by the front end but this is not needed in the cashPo report as all columns should be shown.

  const trendColumnPromises = []

  ///////////////////////////////// TREND COLUMNS
  trendColumnPromises.push(getTrendColsPoCash(config))

  const trendColumnResults = await Promise.all(trendColumnPromises)
  const trendColumns = trendColumnResults
    .reduce((acc, cur) => {
      return acc.concat(cur)
    })
    .map(col => {
      // Add template to trend cols:
      return {
        ...col,
        ...trendColsTemplate,
      }
    })

  ///////////////////////////////// ALL OTHER DATA COLUMNS
  let columnConfigs = {}

  // assemble cols other than labels and trend which are assembled on the front end
  columnConfigs.poCols = poCols
  columnConfigs.apCols = apCols
  columnConfigs.unvouchCols = unvouchCols
  columnConfigs.totalCol = totalCol

  return { columnConfigs, trendColumns }
}

module.exports = getColumns
