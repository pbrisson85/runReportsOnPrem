const invenTotalCols = require('../../data/baseCols/invenTotalCols.js')
const invenKpiCol = require('../../data/baseCols/invenKpiCols.js')
const poCols = require('../../data/baseCols/purchaseOrderCols.js')
const woCols = require('../../data/baseCols/workOrderCols.js')
const salesOrdersCol = require('../../data/baseCols/salesOrderCols.js')
const primarySalesTotalCol = require('../../data/baseCols/salesTotalCols.js')
const poReceiptsCols = require('../../data/baseCols/purchaseReceiptsCols.js')
const trendColsTemplate = require('../../data/baseCols/trendColsTemplate')
const getTrendColsWo = require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsWo').getTrendColsWo
const addDataToProductionTotalCol = require('./colDataHelper').addDataToProductionTotalCol
const addDataToSalesTotalCol = require('./colDataHelper').addDataToSalesTotalCol
const addDataToPoReceiptsTotalCol = require('./colDataHelper').addDataToPoReceiptsTotalCol
const _ = require('lodash')

// These are configs for the columns in the report
const getColumns = async (config, woActivityGroups) => {
  const trendColumnPromises = []

  ///////////////////////////////// TREND COLUMNS
  trendColumnPromises.push(getTrendColsWo(config, woActivityGroups))

  /* RUN DATA */

  const trendColumnResults = await Promise.all(trendColumnPromises)
  const trendColumns = trendColumnResults
    .reduce((acc, cur) => {
      return acc.concat(cur)
    })
    .map(col => {
      return {
        ...col,
        ...trendColsTemplate,
      }
    })

  ///////////////////////////////// ALL OTHER DATA COLUMNS

  let columnConfigs = {}

  // copy woCols or the data will persist between requests
  const woColsCache = _.cloneDeep(woCols)

  if (config?.trends?.yearTrend !== null && typeof config?.trends?.yearTrend !== 'undefined') {
    woCols.forEach((col, idx) => {
      woColsCache[idx].hidden = true
      woColsCache[idx].showByDefault = false
    })
  }

  columnConfigs.woCols = woColsCache
  columnConfigs.invenTotalCols = invenTotalCols
  columnConfigs.invenKpiCol = invenKpiCol
  columnConfigs.poCols = poCols
  columnConfigs.poReceiptsCols = poReceiptsCols
  columnConfigs.salesOrdersCol = salesOrdersCol
  columnConfigs.primarySalesTotalCol = primarySalesTotalCol

  // Add data to hardcoded columns
  columnConfigs = addDataToProductionTotalCol(config, columnConfigs, woActivityGroups) // adds startDate, endDate, and displayName
  columnConfigs = addDataToSalesTotalCol(config, columnConfigs)
  columnConfigs = addDataToPoReceiptsTotalCol(config, columnConfigs)

  return { columnConfigs, trendColumns }
}

module.exports = getColumns
