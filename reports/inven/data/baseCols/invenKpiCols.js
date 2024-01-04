const invenKpiCol = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'WEEKS INV (12 wk sls)', // show as column header
    dataName: 'WeeksInventoryBasedOn12WkSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    rightSticky: true, // css sticky
    right: '800px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'invenKpi',
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'INV AVAIL', // show as column header
    dataName: 'invenAvailable', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    rightSticky: true, // css sticky
    right: '800px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'invenKpi',
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
]

module.exports = invenKpiCol
