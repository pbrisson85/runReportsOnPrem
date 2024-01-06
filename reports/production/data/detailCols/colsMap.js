const invenCols = require('./colsInven')
const purchaseOrderCols = require('./colsPurchaseOrder')
const salesOrderCols = require('./colsSalesOrder')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  inven: invenCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
}

module.exports = detailColsMap
