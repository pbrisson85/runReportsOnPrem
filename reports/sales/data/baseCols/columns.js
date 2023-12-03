const invenFgCols = require('./invenFgCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const salesKpiCols = require('./salesKpiCols.js')
const salesOrdersCol = require('./salesOrderCols.js')
const primarySalesTotalCol = require('./salesTotalCols.js')
const trendCol = require('./trendColsTemplate.js')
const salesProjectionCol = require('./salesProjectionTotalCols.js')

// These are configs for the columns in the report
const columns = { invenFgCols, invenKpiCol, poCols, salesKpiCols, salesOrdersCol, primarySalesTotalCol, trendCol }

module.exports = columns
