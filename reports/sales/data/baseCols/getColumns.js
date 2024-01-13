const invenTotalCols = require('./invenTotalCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const salesKpiCols = require('./salesKpiCols.js')
const salesOrdersCol = require('./salesOrderCols.js')
const primarySalesTotalCol = require('./salesTotalCols.js')

// These are configs for the columns in the report
const getColumns = config => {
  const columns = {}

  if (!config.trends.yearTrend) columns.primarySalesTotalCol = primarySalesTotalCol // No sales total if trend by year
  columns.salesKpiCols = salesKpiCols
  columns.salesOrdersCol = salesOrdersCol
  columns.invenTotalCols = invenTotalCols
  columns.invenKpiCol = invenKpiCol
  columns.poCols = poCols

  return columns
}

module.exports = getColumns
