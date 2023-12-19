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
    decimals: 0,
    rightSticky: true,
    right: '600px',
    hidden: false,
    view: 'weight',
    data: true,
    valueFallback: 0,
    borderLeft: true,
    popoverMsg: 'FINISHED GOOD SALES ORDERS - All Sales Orders including tagged and untagged.',
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'salesOrder', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: true,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = salesOrdersCol
