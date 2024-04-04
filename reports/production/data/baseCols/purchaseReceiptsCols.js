const poReceiptsCols = [
  {
    unfilteredColIdx: 1,
    displayName: 'P.O. RECEIPTS',
    dataName: 'PURCHASE RECEIPTS', // row query column must match the dataName ********* (I changed all the inven go fix)
    displayName_original: 'PURCHASE RECEIPTS', // because it is overwritten when dates are added
    justifyData: 'end',
    justifyHeading: 'center',
    width: '100px',
    number: true,
    boolean: false,
    rightSticky: true,
    right: '0px',
    borderLeft: true,
    hidden: false,
    valueFallback: 0,
    data: true,
    popoverMsg: 'FINISHED GOODS ON PURCHASE ORDERS (UNRECEIVED) - Note: see RM Purchase Planning report for RM On order by program.',
    rightClickMenu: ['Get Details'], // no detail route yet
    drilldownRightClickMenu: ['Get Details'], // no detail route yet
    colType: 'purchaseOrder',
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
]

module.exports = poReceiptsCols
