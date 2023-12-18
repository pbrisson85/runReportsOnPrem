const invenTotalCols = require('./colsinvenTotal')
const purchaseOrderCols = require('./colsPurchaseOrder')
const salesOrderCols = require('./colsSalesOrder')
const salesInvoiceCols = require('./colsSalesInvoice')
const salesProjectionCols = require('./colsSalesProjection')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  invenTotal: invenTotalCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
  salesInvoice: salesInvoiceCols,
  salesProjection: salesProjectionCols,
}

module.exports = detailColsMap
