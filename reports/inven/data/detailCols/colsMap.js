const invenTotalCols = require('./colsinvenTotal')
const purchaseOrderCols = require('./colsPurchaseOrder')
const salesOrderCols = require('./colsSalesOrder')

// Note that the key of this map matches the colType of the col
const detailColsMap = {
  inven: invenTotalCols,
  purchaseOrder: purchaseOrderCols,
  salesOrder: salesOrderCols,
}

module.exports = detailColsMap

// left off trying to get detail and rowSlice to work on inven reports. Was in the middel of renaming inventory col type to inven only. Once detail and slice work next is to get the cols to be able to group by location and rows to be able to have location as well. THEN can move on to the production report. ***************************

// THEN need custom reports where there is a dataType/view and decimals override on the cols so that mixed data types can be show on one report
