const woCols = [
  {
    // displayName: 'CUTTING',  <-- added in colDataHelper
    // dataName: 'CUTTING',  <-- added in colDataHelper
    // trendDefault: true, // will be the default trend col if true  <-- added in colDataHelper
    // colType: 'cuttingWo',  <-- added in colDataHelper
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
    popoverMsg: '',
    rightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    drilldownRightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    drillDownSortable: true,
    allowTrend: true,
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = woCols
