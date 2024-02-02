const invenTotalCols = require('../../data/baseCols/invenTotalCols.js')
const invenKpiCol = require('../../data/baseCols/invenKpiCols.js')
const poCols = require('../../data/baseCols/purchaseOrderCols.js')
const salesKpiCols = require('../../data/baseCols/salesKpiCols.js')
const salesOrdersCol = require('../../data/baseCols/salesOrderCols.js')
const primarySalesTotalCol = require('../../data/baseCols/salesTotalCols.js')
const trendColsTemplate = require('../../data/baseCols/trendColsTemplate.js')
const getTrendColsSales = require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSales').getTrendColsSales
const getTrendColsSo = require('../../postgres/timeSeriesColHeadings/getTimeSeriesColsSo').getTrendColsSo
const addDataToSoTotalCol = require('../helpers/colDataHelper').addDataToSoTotalCol
const addDataToSalesTotalCol = require('../helpers/colDataHelper').addDataToSalesTotalCol
const _ = require('lodash')

// These are configs for the columns in the report
const getColumns = async config => {
  const trendColumnPromises = []

  ///////////////////////////////// TREND COLUMNS
  trendColumnPromises.push(getTrendColsSales(config))
  trendColumnPromises.push(getTrendColsSo(config))

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

  // copy woCols or the data will persist between requests/sessions
  const primarySalesTotalCol_cache = _.cloneDeep(primarySalesTotalCol)
  const salesOrdersCol_cache = _.cloneDeep(salesOrdersCol)

  // if (config?.trends?.yearTrend !== null && typeof config?.trends?.yearTrend !== 'undefined') {
  //   console.log('REMOVING TOTALS COL')

  //   // No sales total if trend by year but keep column so default showtrend works.
  //   primarySalesTotalCol.forEach((col, idx) => {
  //     primarySalesTotalCol_cache[idx].hidden = true
  //     primarySalesTotalCol_cache[idx].showByDefault = false
  //   })

  //   salesOrdersCol.forEach((col, idx) => {
  //     salesOrdersCol_cache[idx].allowTrend = false // because can't get back to the sales trend with no total col to click.
  //   })
  // }

  columnConfigs.primarySalesTotalCol = primarySalesTotalCol_cache
  columnConfigs.salesKpiCols = salesKpiCols
  columnConfigs.salesOrdersCol = salesOrdersCol_cache
  columnConfigs.invenTotalCols = invenTotalCols
  columnConfigs.invenKpiCol = invenKpiCol
  columnConfigs.poCols = poCols

  // Add data to hardcoded columns
  columnConfigs = addDataToSalesTotalCol(config, columnConfigs) // adds startDate, endDate, and displayName to the sales totals col
  columnConfigs = addDataToSoTotalCol(config, columnConfigs) // adds statDate, endDate, and displayName to the sales orders col

  console.log('columnConfigs.primarySalesTotalCol', columnConfigs.primarySalesTotalCol)
  console.log('columnConfigs.salesOrdersCol', columnConfigs.salesOrdersCol)

  return { columnConfigs, trendColumns }
}

module.exports = getColumns
