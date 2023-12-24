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
    rightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Customer',
      'Trend By Customer Type',
      'Trend By Salesperson',
      'Trend By USA vs Export',
      'Trend By North America vs Foreign',
      'Trend By Country',
      'Trend By State',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    drilldownRightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Customer',
      'Trend By Customer Type',
      'Trend By Salesperson',
      'Trend By USA vs Export',
      'Trend By North America vs Foreign',
      'Trend By Country',
      'Trend By State',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    colType: 'salesOrder', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: true,
    trendDefault: false, // will be the default trend col if true
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  // {
  //   unfilteredColIdx: 0,
  //   displayName: 'TAGGED SO',
  //   dataName: 'SALES ORDER TAGGED',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0,
  //   rightSticky: true,
  //   right: '700px',
  //   hidden: false,
  //   view: 'weight',
  //   data: true,
  //   valueFallback: 0,
  //   borderLeft: false,
  //   subColStyle: true, // styling CHANGE
  //   popoverMsg: 'TAGGED SALES ORDERS - All Sales Orders that DO have a specific inventory allocation',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'salesOrder', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   allowTrend: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
  // {
  //   unfilteredColIdx: 0,
  //   displayName: 'UNTAGGED SO',
  //   dataName: 'SALES ORDER UNTAGGED',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0,
  //   rightSticky: true,
  //   right: '500px',
  //   hidden: false,
  //   view: 'weight',
  //   data: true,
  //   valueFallback: 0,
  //   borderLeft: false,
  //   subColStyle: true, // styling CHANGE
  //   popoverMsg: 'UNTAGGED SALES ORDERS - All Sales Orders that DO NOT have a specific inventory allocation',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'salesOrder', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   allowTrend: true,
  //   drillDownSortable: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
]

module.exports = salesOrdersCol
