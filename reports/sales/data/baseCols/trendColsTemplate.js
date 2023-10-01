export const trendCol = {
  unfilteredColIdx: 2,
  //displayName: 1, // array of displayNames and dataNames provided by back end. This template is applied to these in the tableColsAtom
  //dataName: 1, // array of displayNames and dataNames provided by back end. This template is applied to these in the tableColsAtom
  justifyHeading: 'center',
  width: '100px',
  total: false,
  number: true, // flag to use formatTableData model
  percent: false, // flag to use formatTableData model
  date: false, // flag to use formatTableData model
  boolean: false, // flag to use formatTableData model
  decimals: 0, // flag to use formatTableData model
  hidden: false, // flag to filter out col
  view: 'weight',
  valueFallback: 0, // If data provided is not the col default to zero (each row only has one col of data)
  data: true, // flag maps the value in the row to the view (weight, extended_cost, cost_per_lb)
  subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  rightClickMenu: ['Get Details'], // right click option available
  drilldownRightClickMenu: ['Get Details'], // Right click options available in drilldown. Gets filtered in handleRightClickSelectorFamily based on viewingItemDrilldown and viewingCustomerDrilldown
  trendCol: true, // flag used to determine what detail to fetch since the colType will be overwritten with the colType of the applicable total col (either )
  colType: 'salesInvoice', // used as an identifier when requesting detail from back end and then used to set all the cols and filters once detail is obtained
  allowTrend: false, // double click the col headiong to show the col as a trend
  drillDownSortable: true, // used to determine what cols are sortable IN DRILLDOWN MODE
  optional: false, // flag to determine if the col is optional
  showByDefault: true, // flag to determine if optional col is shown by default
}
