const invenCols = require('./colsInven')
const purchaseOrderCols = require('./colsPurchaseOrder')
const salesOrderCols = require('./colsSalesOrder')
const salesInvoiceCols = require('./colsSalesInvoice')
const salesProjectionCols = require('./colsSalesProjection')

// Note that the key of this map matches the colType of the col
const getDetailColsMap = async () => {
  return {
    inven: await invenCols(),
    purchaseOrder: await purchaseOrderCols(),
    salesOrder: await salesOrderCols(),
    salesInvoice: await salesInvoiceCols(),
    salesProjection: await salesProjectionCols(),
  }
}

module.exports = getDetailColsMap
