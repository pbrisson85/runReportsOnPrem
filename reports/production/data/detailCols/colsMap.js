const invenCols = require('./colsInven')
const purchaseOrderCols = require('./colsPurchaseOrder')
const salesOrderCols = require('./colsSalesOrder')
const workOrderCols = require('./colsWorkOrder')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  inven: invenCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
  production: workOrderCols,
}

module.exports = detailColsMap
