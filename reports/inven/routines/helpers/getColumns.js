const invenTotalCols = require('../../data/baseCols/invenTotalCols.js')
const invenKpiCol = require('../../data/baseCols/invenKpiCols.js')
const poCols = require('../../data/baseCols/purchaseOrderCols.js')
const salesOrdersCol = require('../../data/baseCols/salesOrderCols.js')
const ageCol = require('../../data/baseCols/ageColsTemplate.js')
const buildAgingCols = require('./agingColHelper').buildAgingCols

const getColumns = config => {
  const columns = { ageCol, invenTotalCols, invenKpiCol, poCols, salesOrdersCol }
  const columnConfigs = buildAgingCols(config, columns)

  return columnConfigs
}

// The order here determines the order on the front end.

module.exports = getColumns
