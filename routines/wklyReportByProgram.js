const { getDateEndPerWeekByRange } = require('../queries/postgres/generateSalesData/getDateEndPerWeek')
const {
  getAllFgSalesTotalsRow,
  getAllFgSalesColTotals,
  getFgProgramTotalsRow,
  getFgProgramTotalsCol,
  getFgSpeciesGroupTotalsRow,
  getFgSpeciesGroupTotalsCol,
} = require('../queries/postgres/getSales/byProgram/trend')
const getDistinctItemTypes = require('../queries/postgres/getRows/byProcLevel/getDisctinctItemTypes')
const getDistinctBpTypes = require('../queries/postgres/getRows/byProcLevel/getDistinctBpTypes')
const getDistinctProcLevels = require('../queries/postgres/getRows/byProcLevel/getDisctinctProcLevels')
const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapDataToRowTemplates = require('../models/mapDataToRowTemplates')

const getWeeklyProgramSales = async (start, end) => {
  ///////////////////////////////// INVENTORY DATA

  /* OH HAND */

  /* IN TRANSIT */

  /* COMMITTED */

  /* AVAILABLE */

  /* RM ON ORDER */

  /* FG ON ORDER */

  ///////////////////////////////// SALES DATA

  const fgWipRmTotalsRow = await getFgProgramTotalsRow(start, end)
  /*
  "fgWipRmTotalsRow": [
         {
        "column": "2022-W01",
        "maj_row": "COD",
        "min_row": "COD CHN",
        "lbs": -3660,
        "sales": -17245,
        "cogs": -13828.28,
        "othp": 100.26999999999998
    },
    {
        "column": "2022-W01",
        "maj_row": "COD",
        "min_row": "COD USA",
        "lbs": 175340,
        "sales": 1049622.9500000002,
        "cogs": 947689.7399999995,
        "othp": 43466.70999999999
    },
    {
        "column": "2022-W01",
        "maj_row": "FLATFISH",
        "min_row": "FLATFISH CHN",
        "lbs": 35789.6992,
        "sales": 149061.13,
        "cogs": 98996.8,
        "othp": 12357.330000000002
    },
  */

  const fgWipRmTotalsCol = await getFgProgramTotalsCol(start, end)
  /*
  "getFgProgramTotalsCol": [
    {
        "column": "TOTAL",
        "maj_row": "COD",
        "min_row": "COD CHN",
        "lbs": 1470740.428,
        "sales": 6951255.52,
        "cogs": 5739432.030000001,
        "othp": 183559.57999999984
    },
    {
        "column": "TOTAL",
        "maj_row": "COD",
        "min_row": "COD USA",
        "lbs": 6086597.197199999,
        "sales": 35962386.23999998,
        "cogs": 33571707.27999995,
        "othp": 1273874.97
    },
    {
        "column": "TOTAL",
        "maj_row": "FLATFISH",
        "min_row": "FLATFISH CHN",
        "lbs": 9605545.717999998,
        "sales": 31481754.21999999,
        "cogs": 24343992.249999963,
        "othp": 2016905.8899999987
    },
  */

  /* 3: SALES FOR PROGRAM (ALL) BY WEEK = program total */
  const allSalesRowTotals = await getAllFgSalesTotalsRow(start, end)
  /*
  "allSalesRowTotals": [
    {
        "column": "2022-W01",
        "maj_row": "FG SALES",
        "min_row": "TOTAL",
        "lbs": 570530.4892000001,
        "sales": 3650605.8999999985,
        "cogs": 3154600.519999998,
        "othp": 86901.38
    },
    {
        "column": "2022-W02",
        "maj_row": "FG SALES",
        "min_row": "TOTAL",
        "lbs": 725587.9219999999,
        "sales": 5625076.049999998,
        "cogs": 4899364.590000003,
        "othp": 100527.69999999998
    },
    {
        "column": "2022-W03",
        "maj_row": "FG SALES",
        "min_row": "TOTAL",
        "lbs": 536702.5416000001,
        "sales": 4145706.939999997,
        "cogs": 3630620.0600000024,
        "othp": 90319.32
    },
  */

  const allSalesColTotals = await getAllFgSalesColTotals(start, end)
  /*
  "allSalesRowTotals": [
        {
        "column": "TOTAL",
        "maj_row": "FG SALES",
        "min_row": "TOTAL",
        "lbs": 31948279.458400007,
        "sales": 205632410.27000064,
        "cogs": 176277047.73999837,
        "othp": 5897058.769999918
    }
       
  */

  const fgSpeciesGroupTotalsRow = await getFgSpeciesGroupTotalsRow(start, end)
  /*
    "fgSpeciesGroupTotalsRow": [
          {
          "column": "TOTAL",
          "maj_row": "FG SALES",
          "min_row": "TOTAL",
          "lbs": 31948279.458400007,
          "sales": 205632410.27000064,
          "cogs": 176277047.73999837,
          "othp": 5897058.769999918
      }
         
    */

  const fgSpeciesGroupTotalsCol = await getFgSpeciesGroupTotalsCol(start, end)
  /*
      "fgSpeciesGroupTotalsRow": [
            {
            "column": "TOTAL",
            "maj_row": "FG SALES",
            "min_row": "TOTAL",
            "lbs": 31948279.458400007,
            "sales": 205632410.27000064,
            "cogs": 176277047.73999837,
            "othp": 5897058.769999918
        }
           
      */

  return { fgSpeciesGroupTotalsRow, fgSpeciesGroupTotalsCol }

  ///////////////////////////////// ROWS
  // ROW TEMPLATE: ITEM_TYPE
  const row_types_subtotals = await getDistinctItemTypes(start, end)
  /*
  [
    { maj_row: 'FG', min_row: 'subtotal' },
    { maj_row: 'WIP', min_row: 'subtotal' }
  ]
  */

  // ROW TEMPLATE: ITEM_TYPE: BY-PROD
  const row_bp_subtotals = [{ maj_row: 'BP', min_row: 'subtotal' }]

  // ROW TEMPLATE: PROC LEVELS
  const row_proc_details = await getDistinctProcLevels(start, end)
  /*
  [
    { maj_row: 'FG', min_row: 'DRY' },
    { maj_row: 'FG', min_row: 'PROCESSED' }
  ]
  */

  // ROW TEMPLATE: BP TYPES
  const row_by_details = await getDistinctBpTypes(start, end)
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
    [...fgWipRmTotalsRow, ...fgWipRmTotalsCol, ...allSalesRowTotals, ...allSalesColTotals, ...fgWipRmDetRows, ...fgWipRmDetColTotal],
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
