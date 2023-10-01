const { invenFgCols } = require('./colsInvenFg')
const { purchaseOrderCols } = require('./purchaseOrderCols')
const { salesOrderCols } = require('./colsSalesOrder')
const { salesInvoiceCols } = require('./colsSalesInvoice')

// Note that the key of this map matches the colType of the col
export const detailCols = {
  invenFg: invenFgCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
  salesInvoice: salesInvoiceCols,
}
