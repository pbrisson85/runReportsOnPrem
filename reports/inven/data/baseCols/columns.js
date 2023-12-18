const invenTotalCols = require('./invenTotalCols.js')
const invenKpiCol = require('./invenKpiCols.js')
const poCols = require('./purchaseOrderCols.js')
const salesOrdersCol = require('./salesOrderCols.js')
const ageCol = require('./ageColsTemplate.js')

// The order here determines the order on the front end.
const columns = { ageCol, invenTotalCols, invenKpiCol, poCols, salesOrdersCol }

module.exports = columns
