const { invenFgCols } = require('./invenFgCols.js')
const { invenKpiCol } = require('./invenKpiCols.js')
const { poCols } = require('./purchaseOrderCols.js')
const { salesKpiCols } = require('./salesKpiCols.js')
const { openOrdersCol } = require('./salesOrderCols.js')
const { totalsCol } = require('./salesTotalCols.js')
const { trendCol } = require('./trendCols.js')

// These are configs for the columns in the report
const columns = { invenFgCols, invenKpiCol, poCols, salesKpiCols, openOrdersCol, totalsCol, trendCol }

module.exports = columns
