const salesKpiCol = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'YoY', // show as column header
    dataName: 'yoyYtdSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '800px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'Trending', // show as column header
    dataName: 'momentum', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: true,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '800px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'COMPANY %', // show as column header
    dataName: 'percentCompanySales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: true,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '800px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'MAJ SPECIES %', // show as column header
    dataName: 'percentSpeciesGroupSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: true,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths BUT atom is auto calcing this on the right hand cols
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'PROGRAM %', // show as column header
    dataName: 'percentProgramSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: true,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'REPORT %', // show as column header
    dataName: 'percentReportTotal', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: true,
    boolean: false, // flag to use formatTableData model
    decimals: 2, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'WEEKLY AVE', // show as column header
    dataName: 'aveWeeklySales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: '12 WK AVE', // show as column header
    dataName: 'twelveWkAveSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: '8 WK AVE', // show as column header
    dataName: 'eightWkAveSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: '4 WK AVE', // show as column header
    dataName: 'fourWkAveSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: '2 WK AVE', // show as column header
    dataName: 'twoWkAveSales', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    subColStyle: true,
    number: true,
    percent: false,
    boolean: false, // flag to use formatTableData model
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '700px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: false, // border right on ladst frozen cell
    popoverMsg: '',
    rightClickMenu: [],
    drilldownRightClickMenu: [],
    colType: 'salesKpi', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: false,
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
]

module.exports = salesKpiCol
