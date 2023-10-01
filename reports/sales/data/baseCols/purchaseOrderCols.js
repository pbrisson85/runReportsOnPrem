export const poCols = [
  {
    unfilteredColIdx: 1,
    displayName: 'FG P.O.',
    dataName: 'FG ON ORDER',
    justifyData: 'end',
    justifyHeading: 'center',
    width: '100px',
    number: true,
    boolean: false,
    decimals: 0, // flip when fliping view
    rightSticky: true,
    right: '0px',
    borderLeft: true,
    hidden: false,
    view: 'weight',
    valueFallback: 0,
    data: true,
    popoverMsg: 'FINISHED GOODS ON PURCHASE ORDERS (UNRECEIVED) - Note: see RM Purchase Planning report for RM On order by program.',
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'purchaseOrder', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]
