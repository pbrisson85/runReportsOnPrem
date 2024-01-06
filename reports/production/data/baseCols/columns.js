const invenTotalCols = require('./invenTotalCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const salesOrdersCol = require('./salesOrderCols.js')

// These are configs for the columns in the report
const columns = { salesOrdersCol, invenTotalCols, invenKpiCol, poCols }

module.exports = columns
