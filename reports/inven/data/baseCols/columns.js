const invenFgCols = require('./invenFgCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const salesOrdersCol = require('./salesOrderCols.js')
const trendCol = require('./trendColsTemplate.js')

// These are configs for the columns in the report
const columns = { invenFgCols, invenKpiCol, poCols, salesKpiCols, salesOrdersCol, primarySalesTotalCol, trendCol }

module.exports = columns
