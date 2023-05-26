const { getDateEndPerWeekByRange } = require('../queries/postgres/generateSalesData/getDateEndPerWeek')
const {
  getFgWipRmDetRows,
  getFgWipRmDetColTotal,
  getAllSalesRowTotals,
  getAllSalesColTotals,
  getFgWipRmTotalsRow,
  getByProdTotRow,
  getFgWipRmTotalsCol,
  getByProdColTotal,
  getByProdDetRows,
  getByProdDetColTotals,
} = require('../queries/postgres/getSales/byProcLevel/trend')
const getDistinctItemTypes = require('../queries/postgres/getRows/byProcLevel/getDisctinctItemTypes')
const getDistinctBpTypes = require('../queries/postgres/getRows/byProcLevel/getDistinctBpTypes')
const getDistinctProcLevels = require('../queries/postgres/getRows/byProcLevel/getDisctinctProcLevels')
const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapSalesToRowTemplates = require('../models/mapSalesToRowTemplates')

const getWeeklyProgramSales = async (program, start, end) => {
  ///////////////////////////////// INVENTORY DATA

  /* 1: ON HAND FOR PROGRAM BY ITEM_TYPE BY WEEK (FG, WIP, RM, NO: BY-PROD) = subtotal */
  //const fgWipRmTotalsRow = await getFgWipRmTotalsRow(program, start, end)
  /*
  "fgWipRmTotalsRow": [
        {
            "week_serial": "ON HAND",
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

  /* COMMITTED */

  /* AVAILABLE */

  ///////////////////////////////// SALES DATA

  /* 1: SALES FOR PROGRAM BY ITEM_TYPE BY WEEK (FG, WIP, RM, NO: BY-PROD) = subtotal */
  const fgWipRmTotalsRow = await getFgWipRmTotalsRow(program, start, end)
  /*
  "fgWipRmTotalsRow": [
        {
            "column": "2022-W01",
            "maj_row": "FG",
            "lbs": -3660,
            "sales": -17245,
            "cogs": -13828.28,
            "othp": 100.26999999999998
        },
        {
            "column": "2022-W02",
            "maj_row": "FG",
            "lbs": 35178,
            "sales": 116087.4,
            "cogs": 110577.4,
            "othp": 534.7099999999919
        },
  */

  /* 1: DATE RANGE TOTAL SALES FOR PROGRAM BY ITEM_TYPE (FG, WIP, RM, NO: BY-PROD) = subtotal */
  const fgWipRmTotalsCol = await getFgWipRmTotalsCol(program, start, end)
  /*
  "getFgWipRmTotalsCol": [
        {
            "column": "TOTAL",
            "maj_row": "FG",
            "lbs": -3660,
            "sales": -17245,
            "cogs": -13828.28,
            "othp": 100.26999999999998
        },
        {
            "column": "TOTAL",
            "maj_row": "RM",
            "lbs": 35178,
            "sales": 116087.4,
            "cogs": 110577.4,
            "othp": 534.7099999999919
        },
  */

  /* 2: SALES FOR PROGRAM BY ITEM_TYPE BY WEEK (BY-PROD) = subtotal */
  const byProdTotRow = await getByProdTotRow(program, start, end)
  /*
  "byProdTotRow": [
        {
            "column": "2022-W01",
            "maj_row": "BP",
            "lbs": 21720,
            "sales": 50058,
            "cogs": 20180.12,
            "othp": 573.4000000000005
        },
        {
            "column": "2022-W02",
            "maj_row": "BP",
            "lbs": 1920,
            "sales": 6078,
            "cogs": 2301.65,
            "othp": 18.750000000000114
        },
  */

  /* 2: DATE RANGE TOTAL SALES FOR PROGRAM BY ITEM_TYPE (BY-PROD) = subtotal */
  const byProdColTotal = await getByProdColTotal(program, start, end)
  /*
  "byProdTotRow": [
        {
            "column": "TOTAL",
            "maj_row": "BP",
            "lbs": 21720,
            "sales": 50058,
            "cogs": 20180.12,
            "othp": 573.4000000000005
        },
        
  */

  /* 3: SALES FOR PROGRAM (ALL) BY WEEK = program total */
  const allSalesRowTotals = await getAllSalesRowTotals(program, start, end)
  /*
  "allSalesRowTotals": [
        {
            "column": "2022-W01",
            "lbs": 94393,
            "sales": 1097004.0700000005,
            "cogs": 927959.9199999995,
            "othp": 6863.490000000001,
            "maj_row": "TOTAL"
        },
        {
            "column": "2022-W02",
            "lbs": 64050.55810000001,
            "sales": 923604.4400000002,
            "cogs": 777095.29,
            "othp": 4774.490000000006,
            "maj_row": "TOTAL"
        },
  */

  /* 3: DATE RANGE TOTAL SALES FOR PROGRAM (ALL) = program total */
  const allSalesColTotals = await getAllSalesColTotals(program, start, end)
  /*
  "allSalesRowTotals": [
        {
            "column": "TOTAL",
            "lbs": 94393,
            "sales": 1097004.0700000005,
            "cogs": 927959.9199999995,
            "othp": 6863.490000000001,
            "maj_row": "TOTAL"
        },
       
  */

  /* 4: FG SALES BY PROCESSING LEVEL FOR PROGRAM = FG detail BY WEEK */ // <---- THIS DATA WILL SWITCH OUT FOR DIFFERENT FG DETAIL CATEGORIES
  const fgWipRmDetRows = await getFgWipRmDetRows(program, start, end)
  /*
  "fgWipRmDetRows": [
        {
            "column": "2022-W01",
            "maj_row": "FG",
            "min_row": "DRY",
            "lbs": 15223,
            "sales": 276067.67000000004,
            "cogs": 247561.06000000003,
            "othp": 363.47999999999814
        },
        {
            "column": "2022-W01",
            "maj_row": "FG",
            "min_row": "LIGHT",
            "lbs": 9550,
            "sales": 158202.79999999987,
            "cogs": 150058.38999999996,
            "othp": 2962.7100000000028
        },
  */

  /* 4: DATE RANGE TOTAL FG SALES BY PROCESSING LEVEL FOR PROGRAM = FG detail */ // <---- THIS DATA WILL SWITCH OUT FOR DIFFERENT FG DETAIL CATEGORIES
  const fgWipRmDetColTotal = await getFgWipRmDetColTotal(program, start, end)
  /*
  "fgWipRmDetRows": [
        {
            "column": "TOTAL",
            "maj_row": "FG",
            "min_row": "DRY",
            "lbs": 15223,
            "sales": 276067.67000000004,
            "cogs": 247561.06000000003,
            "othp": 363.47999999999814
        },
        {
            "column": "TOTAL",
            "maj_row": "FG",
            "min_row": "LIGHT",
            "lbs": 9550,
            "sales": 158202.79999999987,
            "cogs": 150058.38999999996,
            "othp": 2962.7100000000028
        },
  */

  /* 5: BP SALES BY TYPE FOR PROGRAM BY WEEK = BP detail */
  const byProdDetRows = await getByProdDetRows(program, start, end)
  /*
  byProdDetRows
  [
    {
        "column": "2022-W01",
        "maj_row": "BP",
        "min_row": "CHUNKS",
        "lbs": 130,
        "sales": 910,
        "cogs": 159.04,
        "othp": 0
    },
    {
        "column": "2022-W01",
        "maj_row": "BP",
        "min_row": "PIECES",
        "lbs": 21590,
        "sales": 49148,
        "cogs": 20021.079999999998,
        "othp": 573.4000000000005
    },
  */

  /* 5: BP SALES BY TYPE FOR PROGRAM BY WEEK = BP detail */
  const byProdDetColTotals = await getByProdDetColTotals(program, start, end)
  /*
  byProdDetRows
  [
    {
        "column": "TOTAL",
        "maj_row": "BP",
        "min_row": "CHUNKS",
        "lbs": 130,
        "sales": 910,
        "cogs": 159.04,
        "othp": 0
    },
    {
        "column": "TOTAL",
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

  const mappedSales = mapSalesToRowTemplates(
    [
      ...fgWipRmTotalsRow,
      ...fgWipRmTotalsCol,
      ...byProdTotRow,
      ...byProdColTotal,
      ...allSalesRowTotals,
      ...allSalesColTotals,
      ...fgWipRmDetRows,
      ...fgWipRmDetColTotal,
      ...byProdDetRows,
      ...byProdDetColTotals,
    ],
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
