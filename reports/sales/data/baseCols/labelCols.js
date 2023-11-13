const getCols = body => {
  const { reportFormat } = body

  const template = {
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  }

  switch (reportFormat) {
    case 'typeSpecgroupFreeze':
      return applyTemplate(template, typeSpecgroupFreeze)

    case 'speciesgroupProg':
      return applyTemplate(template, speciesgroupProg)

    case 'speciesgroupProgSpec':
      return applyTemplate(template, speciesgroupProgSpec)

    case 'speciesgroupFreeze':
      return applyTemplate(template, speciesgroupFreeze)

    case 'speciesgroupProgFrz':
      return applyTemplate(template, speciesgroupProgFrz)

    case 'speciesgroupBrandSkin':
      return applyTemplate(template, speciesgroupBrandSkin)

    case 'speciesgroupSkinBrand':
      return applyTemplate(template, speciesgroupSkinBrand)

    case 'frzBrndSize':
      return applyTemplate(template, frzBrndSize)

    case 'frzSoakSize':
      return applyTemplate(template, frzSoakSize)

    case 'specBrndSize':
      return applyTemplate(template, specBrndSize)

    case 'specBrndSoakSize':
      return applyTemplate(template, specBrndSoakSize)

    case 'specSoakSize':
      return applyTemplate(template, specSoakSize)

    case 'frzBrndSoakSize':
      return applyTemplate(template, frzBrndSoakSize)

    case 'frzBrndSoakItem':
      return applyTemplate(template, frzBrndSoakItem)

    default:
      return applyTemplate(template, speciesgroupFreeze) // must match default in config file
  }
}

const applyTemplate = (template, cols) => {
  return cols.map(col => {
    return { ...template, ...col }
  })
}

const typeSpecgroupFreeze = [
  {
    displayName: 'ITEM TYPE', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '100px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'PROGRAM', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '275px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupProg = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'PROGRAM', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupProgFrz = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'PROGRAM', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'FREEZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '350px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupProgSpec = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'PROGRAM', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SPECIES', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '350px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupBrandSkin = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SKIN', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '350px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupSkinBrand = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SKIN', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '350px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const speciesgroupFreeze = [
  {
    displayName: 'MAJOR CATEGORY', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'FREEZE', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '175px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const frzBrndSize = [
  {
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '150px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '300px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const frzBrndSoakSize = [
  {
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '150px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SOAK', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '300px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l4_label', // key to pull data from
    filterName: 'l4_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '400px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const frzBrndSoakItem = [
  {
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '150px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SOAK', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '300px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'ITEM', // show as column header
    dataName: 'l4_label', // key to pull data from
    filterName: 'l4_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '400px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const frzSoakSize = [
  {
    displayName: 'FRESH/FROZEN', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SOAK', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '150px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '300px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const specBrndSize = [
  {
    displayName: 'SPECIES', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '200px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '200px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '375px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const specSoakSize = [
  {
    displayName: 'SPECIES', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '200px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SOAK', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '175px', // css width
    left: '200px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '375px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

const specBrndSoakSize = [
  {
    displayName: 'SPECIES', // show as column header
    dataName: 'l1_label', // key to pull data from
    filterName: 'l1_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '0px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'BRAND', // show as column header
    dataName: 'l2_label', // key to pull data from
    filterName: 'l2_filter', // key to match up the column with the filter
    width: '150px', // css width
    left: '150px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SOAK', // show as column header
    dataName: 'l3_label', // key to pull data from
    filterName: 'l3_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '300px', // css positioning for sticky sum of prior col widths
    borderRight: false, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
  {
    displayName: 'SIZE', // show as column header
    dataName: 'l4_label', // key to pull data from
    filterName: 'l4_filter', // key to match up the column with the filter
    width: '100px', // css width
    left: '400px', // css positioning for sticky sum of prior col widths
    borderRight: true, // border right on ladst frozen cell
    rightClickMenu: [], // array of options for right click menu
  },
]

module.exports = getCols
