const invenTotalCols = require('./invenTotalCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const woCols = require('./workOrderCols.js')
const salesOrdersCol = require('./salesOrderCols.js')
const primarySalesTotalCol = require('./salesTotalCols.js')
const poReceiptsCols = require('./purchaseReceiptsCols.js')

// These are configs for the columns in the report
const getColumns = config => {
  const columns = {}

  if (!config.trends.yearTrend) columns.woCols = woCols // No sales total if trend by year
  columns.invenTotalCols = invenTotalCols
  columns.invenKpiCol = invenKpiCol
  columns.poCols = poCols
  columns.poReceiptsCols = poReceiptsCols
  columns.salesOrdersCol = salesOrdersCol
  columns.primarySalesTotalCol = primarySalesTotalCol

  return columns
}

module.exports = getColumns
