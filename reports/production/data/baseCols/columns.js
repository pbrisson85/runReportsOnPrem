const invenTotalCols = require('./invenTotalCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const woCols = require('./workOrderCols.js')
const salesOrdersCol = require('./salesOrderCols.js')

// These are configs for the columns in the report
const columns = { woCols, invenTotalCols, invenKpiCol, poCols, salesOrdersCol }

module.exports = columns
