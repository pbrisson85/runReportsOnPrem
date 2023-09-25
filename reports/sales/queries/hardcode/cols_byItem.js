const cols = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'ITEM', // show as column header
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
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
    searchable: true, // flag to determine if col is searchable
    searchValue: null, // placeholder for the search filter
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'DESCRIPTION', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '250px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '100px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
    searchable: true, // flag to determine if col is searchable
    searchValue: null, // placeholder for the search filter
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'FREEZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '350px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'SOAK', // show as column header
    dataName: 'l4_label', // key to pull data from
    filterName: 'l4_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '450px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'BRAND', // show as column header
    dataName: 'l5_label', // key to pull data from
    filterName: 'l5_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '550px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'SIZE', // show as column header
    dataName: 'l6_label', // key to pull data from
    filterName: 'l6_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '650px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
    drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  },
]

module.exports = cols
