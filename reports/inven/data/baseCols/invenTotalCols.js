const invenCols = [
  {
    unfilteredColIdx: 1,
    displayName: 'INVEN',
    dataName: 'INVEN',
    justifyData: 'end',
    justifyHeading: 'center',
    width: '100px',
    number: true,
    boolean: false,
    rightSticky: true,
    right: '400px',
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
    colType: 'inven',
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = invenCols
