const invenTotalCols = [
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
    popoverMsg: 'FINISHD GOOD INVENTORY - All FG inventory not including any byproducts or RM',
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'inven',
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = invenTotalCols
