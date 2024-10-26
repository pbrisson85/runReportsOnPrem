const primarySalesTotalCol = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    displayName: 'SALES', // show as column header
    displayName_original: 'SALES', // because it is overwritten when dates are added
    dataName: 'SALES TOTAL', // key to pull data from
    justifyData: 'end', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: true,
    boolean: false, // flag to use formatTableData model
    rightSticky: true, // css sticky
    right: '900px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    data: true,
    valueFallback: 0,
    borderLeft: true, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [], // no detail route yet
    drilldownRightClickMenu: [], // no detail route yet
    colType: 'salesInvoice',
    allowTrend: false,
    trendDefault: false, // will be the default trend col if true
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: false, // flag to determine if optional col is shown by default
  },
]

module.exports = primarySalesTotalCol
