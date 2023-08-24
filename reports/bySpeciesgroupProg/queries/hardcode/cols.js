const getCols = body => {
  const { format } = body

  console.log('(in col selection) format: ', format)

  switch (format) {
    case 'speciesgroupProg':
      return speciesgroupProg

    case 'speciesgroupFreeze':
      return speciesgroupFreeze

    case 'speciesgroupBrandSkin':
      return speciesgroupBrandSkin

    case 'frzBrndSize':
      return frzBrndSize

    case 'frzSoakSize':
      return frzSoakSize

    case 'specBrndSize':
      return specBrndSize

    case 'specSoakSize':
      return specSoakSize

    default:
      return speciesgroupProg
  }
}

const speciesgroupProg = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'bySpeciesgroupProg', // report name (used in API calls to get detail data)
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '0px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'bySpeciesgroupProg', // report name (used in API calls to get detail data)
    displayName: 'PROGRAM', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '175px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const speciesgroupBrandSkin = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'speciesgroupBrandSkin', // report name (used in API calls to get detail data)
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '0px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'speciesgroupBrandSkin', // report name (used in API calls to get detail data)
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '175px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'speciesgroupBrandSkin', // report name (used in API calls to get detail data)
    displayName: 'SKIN', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '300px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const speciesgroupFreeze = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'bySpeciesgroupProg', // report name (used in API calls to get detail data)
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '0px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'bySpeciesgroupProg', // report name (used in API calls to get detail data)
    displayName: 'FREEZE', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '175px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const frzBrndSize = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzBrndSize', // report name (used in API calls to get detail data)
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '150px', // css width
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
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzBrndSize', // report name (used in API calls to get detail data)
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '150px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '150px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzBrndSize', // report name (used in API calls to get detail data)
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '300px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const frzSoakSize = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzSoakSize', // report name (used in API calls to get detail data)
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '150px', // css width
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
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzSoakSize', // report name (used in API calls to get detail data)
    displayName: 'SOAK', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '150px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '150px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgByFrzSoakSize', // report name (used in API calls to get detail data)
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '300px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const specBrndSize = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecBrndSize', // report name (used in API calls to get detail data)
    displayName: 'SPECIES', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '200px', // css width
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
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecBrndSize', // report name (used in API calls to get detail data)
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '200px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecBrndSize', // report name (used in API calls to get detail data)
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '375px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

const specSoakSize = [
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecSoakSize', // report name (used in API calls to get detail data)
    displayName: 'SPECIES', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '200px', // css width
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
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecSoakSize', // report name (used in API calls to get detail data)
    displayName: 'SOAK', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '175px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '200px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  {
    unfilteredColIdx: 0, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    reportName: 'forProgBySpecSoakSize', // report name (used in API calls to get detail data)
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    width: '100px', // css width
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    left: '375px', // css positioning for sticky sum of prior col widths
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
]

module.exports = getCols
