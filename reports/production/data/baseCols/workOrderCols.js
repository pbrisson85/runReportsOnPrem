const woCols = [
  {
    unfilteredColIdx: 1,
    displayName: 'CUTTING',
    displayName_original: 'CUTTING',
    dataName: 'CUTTING',
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
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'cuttingWo',
    drillDownSortable: true,
    allowTrend: true,
    trendDefault: true, // will be the default trend col if true
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 1,
    displayName: 'PACKING',
    displayName_original: 'PACKING',
    dataName: 'PACKING',
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
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'packingWo',
    drillDownSortable: true,
    allowTrend: true,
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = woCols
