const salesOrdersCol = [
  {
    unfilteredColIdx: 0,
    displayName: 'SALES ORDERS',
    displayName_original: 'SALES ORDERS', // because it is overwritten when dates are added
    dataName: 'SALES ORDER',
    justifyData: 'end',
    justifyHeading: 'center',
    width: '100px',
    number: true,
    boolean: false,
    rightSticky: true,
    right: '600px',
    hidden: false,
    data: true,
    valueFallback: 0,
    borderLeft: true,
    popoverMsg: 'FINISHED GOOD SALES ORDERS - All Sales Orders including tagged and untagged.',
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'salesOrder',
    allowTrend: true,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
]

module.exports = salesOrdersCol
