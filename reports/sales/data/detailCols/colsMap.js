const { invenFgCols } = require('./colsInvenFg')
const { purchaseOrderCols } = require('./purchaseOrderCols')
const { salesOrderCols } = require('./colsSalesOrder')
const { salesInvoiceCols } = require('./colsSalesInvoice')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  invenFg: invenFgCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
  salesInvoice: salesInvoiceCols,
}

module.exports.detailColsMap = detailColsMap
