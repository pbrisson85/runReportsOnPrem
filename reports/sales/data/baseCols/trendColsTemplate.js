const trendCol = {
  // displayName: 1, // handled in postgres trend col query
  // dataName: 1, // handled in postgres trend col query
  // colType: 'trendCols', // handled in postgres trend col query
  unfilteredColIdx: 2,
  justifyHeading: 'center',
  width: '100px',
  total: false,
  number: true, // flag to use formatTableData model
  percent: false, // flag to use formatTableData model
  date: false, // flag to use formatTableData model
  boolean: false, // flag to use formatTableData model
  hidden: false, // flag to filter out col
  valueFallback: 0, // If data provided is not the col default to zero (each row only has one col of data)
  data: true, // flag maps the value in the row to the view (weight, extended_cost, cost_per_lb)
  subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  rightClickMenu: ['Get Details'], // right click option available
  drilldownRightClickMenu: ['Get Details'], // Right click options available in drilldown. Gets filtered in handleRightClickSelectorFamily based on viewingItemDrilldown and viewingCustomerDrilldown
  trendCol: true, // flag used to determine what detail to fetch since the colType will be overwritten with the colType of the applicable total col (either )
  allowTrend: false, // double click the col headiong to show the col as a trend
  drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  optional: false, // flag to determine if the col is optional
  showByDefault: true, // flag to determine if optional col is shown by default
}

module.exports = trendCol
