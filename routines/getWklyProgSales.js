const { getDateEndPerWeekByRange } = require('../queries/postgres/getDateEndPerWeek')
const getWklySalesByProg = require('../queries/postgres/getSales/byWkForProg')
const getWklySalesByProcLevel = require('../queries/postgres/getSales/byWkForProgByProcLevel')
const { getWklySalesByItemTypeWithoutBp, getWklySalesByItemTypeBp } = require('../queries/postgres/getSales/byWkForProgByItemType')
const getWklyBpByType = require('../queries/postgres/getSales/byWkForProgBpByType')
const getDistinctItemTypes = require('../queries/postgres/getRows/getDisctinctItemTypes')
const getDistinctBpTypes = require('../queries/postgres/getRows/getDistinctBpTypes')
const getDistinctProcLevels = require('../queries/postgres/getRows/getDisctinctProcLevels')
const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapDataToRowTemplates = require('../models/mapDataToRowTemplates')

const getWeeklyProgramSales = async (program, start, end) => {
  /* SALES FOR PROGRAM BY ITEM_TYPE (FG, WIP, RM, NO: BY-PROD) = subtotal */
  const wklySalesByItemTypeWithoutBp = await getWklySalesByItemTypeWithoutBp(program, start, end)
  /*
  "wklySalesByItemTypeWithoutBp": [
        {
            "week_serial": "2022-W01",
            "maj_row": "FG",
            "lbs": -3660,
            "sales": -17245,
            "cogs": -13828.28,
            "othp": 100.26999999999998
        },
        {
            "week_serial": "2022-W02",
            "maj_row": "FG",
            "lbs": 35178,
            "sales": 116087.4,
            "cogs": 110577.4,
            "othp": 534.7099999999919
        },
  */

  /* SALES FOR PROGRAM BY ITEM_TYPE (BY-PROD) = subtotal */
  const wklySalesByItemTypeBp = await getWklySalesByItemTypeBp(program, start, end)
  /*
  "wklySalesByItemTypeBp": [
        {
            "week_serial": "2022-W01",
            "maj_row": "BP",
            "lbs": 21720,
            "sales": 50058,
            "cogs": 20180.12,
            "othp": 573.4000000000005
        },
        {
            "week_serial": "2022-W02",
            "maj_row": "BP",
            "lbs": 1920,
            "sales": 6078,
            "cogs": 2301.65,
            "othp": 18.750000000000114
        },
  */

  /* SALES FOR PROGRAM (ALL) = program total */
  const wklyProgSalesTotal = await getWklySalesByProg(program, start, end)
  /*
  "wklyProgSalesTotal": [
        {
            "week_serial": "2022-W01",
            "lbs": 94393,
            "sales": 1097004.0700000005,
            "cogs": 927959.9199999995,
            "othp": 6863.490000000001,
            "maj_row": "TOTAL"
        },
        {
            "week_serial": "2022-W02",
            "lbs": 64050.55810000001,
            "sales": 923604.4400000002,
            "cogs": 777095.29,
            "othp": 4774.490000000006,
            "maj_row": "TOTAL"
        },
  */

  /* FG SALES BY PROCESSING LEVEL FOR PROGRAM = FG detail */ // <---- THIS DATA WILL SWITCH OUT FOR DIFFERENT FG DETAIL CATEGORIES
  const wklyProgSalesByProcLevel = await getWklySalesByProcLevel(program, start, end)
  /*
  "wklyProgSalesByProcLevel": [
        {
            "week_serial": "2022-W01",
            "maj_row": "FG",
            "min_row": "DRY",
            "lbs": 15223,
            "sales": 276067.67000000004,
            "cogs": 247561.06000000003,
            "othp": 363.47999999999814
        },
        {
            "week_serial": "2022-W01",
            "maj_row": "FG",
            "min_row": "LIGHT",
            "lbs": 9550,
            "sales": 158202.79999999987,
            "cogs": 150058.38999999996,
            "othp": 2962.7100000000028
        },
  */

  /* BP SALES BY TYPE FOR PROGRAM = BP detail */
  const wklyBpSalesByType = await getWklyBpByType(program, start, end)
  /*
  wklyBpSalesByType
  [
    {
        "week_serial": "2022-W01",
        "maj_row": "BP",
        "min_row": "CHUNKS",
        "lbs": 130,
        "sales": 910,
        "cogs": 159.04,
        "othp": 0
    },
    {
        "week_serial": "2022-W01",
        "maj_row": "BP",
        "min_row": "PIECES",
        "lbs": 21590,
        "sales": 49148,
        "cogs": 20021.079999999998,
        "othp": 573.4000000000005
    },
  */

  ///////////////////////////////// ROWS
  // ROW TEMPLATE: ITEM_TYPE
  const row_types_subtotals = await getDistinctItemTypes(program, start, end)
  /*
  [
    { maj_row: 'FG', min_row: 'subtotal' },
    { maj_row: 'WIP', min_row: 'subtotal' }
  ]
  */

  // ROW TEMPLATE: ITEM_TYPE: BY-PROD
  const row_bp_subtotals = [{ maj_row: 'BP', min_row: 'subtotal' }]

  // ROW TEMPLATE: PROC LEVELS
  const row_proc_details = await getDistinctProcLevels(program, start, end)
  /*
  [
    { maj_row: 'FG', min_row: 'DRY' },
    { maj_row: 'FG', min_row: 'PROCESSED' }
  ]
  */

  // ROW TEMPLATE: BP TYPES
  const row_by_details = await getDistinctBpTypes(program, start, end)
  /*
  [
    { maj_row: 'BP', min_row: 'PIECES' },
    { maj_row: 'BP', min_row: 'CHUNKS' }
  ]
  */

  // ROW TEMPLATE: PROGRAM TOTAL
  const row_total = [{ maj_row: program, min_row: 'total' }]
  /*
    [
      { maj_row: [program], min_row: 'TOTAL' },
    ]
  */

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...row_types_subtotals, ...row_bp_subtotals, ...row_proc_details, ...row_by_details]
    .sort((a, b) => {
      if (a.min_row < b.min_row) return -1
      if (a.min_row > b.min_row) return 1
      return 0
    })
    .sort((a, b) => {
      if (a.maj_row < b.maj_row) return -1
      if (a.maj_row > b.maj_row) return 1
      return 0
    })

  rowTemplate.push(...row_total)

  // map data into row template
  const rowTemplate_unflat = unflattenRowTemplate(rowTemplate)
  /*
  {
    "research": {
        "row": "research"
    },
    "PROCESSED": {
        "row": "PROCESSED"
    },
    "DRY": {
        "row": "DRY"
    },
    "TOTAL": {
        "row": "TOTAL"
    }
  }
  */

  const mappedSales = mapDataToRowTemplates(
    [...wklySalesByItemTypeWithoutBp, ...wklySalesByItemTypeBp, ...wklyProgSalesTotal, ...wklyProgSalesByProcLevel, ...wklyBpSalesByType],
    rowTemplate_unflat
  )
  /*
  mappedSales
{
 "PROCESSED": {
        "row": "PROCESSED",
        "2022-W01": {
            "weight": 1930,
            "revenue": 8922.5,
            "cogs": 7067.25,
            "othp": 0,
            "netSales": 8922.5,
            "grossMargin": 1855.25,
            "revenuePerLb": 4.62,
            "cogsPerLb": 3.66,
            "othpPerLb": 0,
            "netSalesPerLb": 4.62,
            "grossMarginPerLb": 0.96
        },
        "2022-W02": {
            "weight": 12560,
            "revenue": 57672,
            "cogs": 43752.26,
            "othp": 3895.99,
            "netSales": 53776.01,
            "grossMargin": 10023.75,
            "revenuePerLb": 4.59,
            "cogsPerLb": 3.48,
            "othpPerLb": 0.31,
            "netSalesPerLb": 4.28,
            "grossMarginPerLb": 0.8
        },
  */

  // clean out rows with zero sales
  Object.keys(mappedSales).forEach(key => {
    if (Object.keys(mappedSales[key]).length === 1) {
      delete mappedSales[key]
    }
  })

  const flattenedMappedSales = Object.values(mappedSales)

  // get data column names
  const dataCols = await getDateEndPerWeekByRange(start, end)
  /*
   "cols": [
        {
            "dataname": "2022-W01",
            "displayname": "4/9/2022"
        },
        {
            "dataname": "2022-W02",
            "displayname": "4/16/2022"
        },
        {
            "dataname": "2022-W03",
            "displayname": "4/23/2022"
        },
  */

  // return
  return { data: flattenedMappedSales, cols: dataCols }
}

module.exports = getWeeklyProgramSales
