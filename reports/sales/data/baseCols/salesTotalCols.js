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
    decimals: 0, // flip when fliping view ****************************************************************
    rightSticky: true, // css sticky
    right: '900px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: 'weight', // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: true,
    valueFallback: 0,
    borderLeft: true, // border right on ladst frozen cell
    popoverMsg: 'Sum of all sales invoices (FG, no RM or byproduct) for the period specific per filter (YTD by default).',
    rightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Customer',
      'Trend By Customer Type',
      'Trend By Salesperson',
      'Trend By USA vs Export',
      'Trend By North America vs Foreign',
      'Trend By Country',
      'Trend By State',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    drilldownRightClickMenu: [
      'Get Details',
      'Trend By Item',
      'Trend By Customer',
      'Trend By Customer Type',
      'Trend By Salesperson',
      'Trend By USA vs Export',
      'Trend By North America vs Foreign',
      'Trend By Country',
      'Trend By State',
      'Trend By Fresh vs Frozen',
      'Trend By Species Group',
      'Trend By Species',
      'Trend By Program',
    ],
    colType: 'salesInvoice', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    allowTrend: true,
    drillDownSortable: true,
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = primarySalesTotalCol
