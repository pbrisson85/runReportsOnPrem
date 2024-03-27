const cols = [
  {
    unfilteredColIdx: 1,
    displayName: 'PO',
    dataName: 'PURCHASE ORDER', // row query column must match the dataName *********
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
    colType: 'purchaseOrder',
    drillDownSortable: true,
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = cols