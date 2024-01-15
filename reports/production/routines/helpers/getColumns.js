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
  console.log('getting columns.....')
  console.log('woActivityGroups', woActivityGroups)

  console.log('woCols', woCols)

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

  console.log('config?.trends?.yearTrend', config.trends.yearTrend)
  console.log('SETTING TO HIDDEN: ', config?.trends?.yearTrend !== null && typeof config?.trends?.yearTrend !== 'undefined')

  // copy woCols or the data will persist between requests
  const woColsCache = _.cloneDeep(woCols)

  if (config?.trends?.yearTrend !== null && typeof config?.trends?.yearTrend !== 'undefined') {
    console.log('HAS YEAR TRENDS !!!!!!!!!!!!!!!')

    woCols.forEach((col, idx) => {
      console.log('setting hidden = TRUE for WO TOTALS !!!!!!!!!!!!!!!!!!')

      woColsCache[idx].hidden = true
      woColsCache[idx].showByDefault = false
    })
  }

  console.log('AFTER the loop to hide:', woCols)

  columnConfigs.woCols = woColsCache
  columnConfigs.invenTotalCols = invenTotalCols
  columnConfigs.invenKpiCol = invenKpiCol
  columnConfigs.poCols = poCols
  columnConfigs.poReceiptsCols = poReceiptsCols
  columnConfigs.salesOrdersCol = salesOrdersCol
  columnConfigs.primarySalesTotalCol = primarySalesTotalCol

  console.log('before col data helper: woCols: ', woCols)
  console.log('before col data helper: columnConfigs.woCols: ', columnConfigs.woCols)

  // Add data to hardcoded columns
  columnConfigs = addDataToProductionTotalCol(config, columnConfigs, woActivityGroups) // adds startDate, endDate, and displayName
  columnConfigs = addDataToSalesTotalCol(config, columnConfigs)
  columnConfigs = addDataToPoReceiptsTotalCol(config, columnConfigs)

  console.log('FINAL returning columnConfigs', columnConfigs.woCols)

  return { columnConfigs, trendColumns }
}

module.exports = getColumns
