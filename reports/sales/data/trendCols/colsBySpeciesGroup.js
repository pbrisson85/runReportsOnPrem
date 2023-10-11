const cols = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'SPECIES GROUP', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '0px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
    searchable: false, // flag to determine if col is searchable
    searchValue: null, // placeholder for the search filter
  },
]

module.exports = cols
