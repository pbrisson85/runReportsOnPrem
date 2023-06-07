const { getDateEndPerWeekByRange } = require('../queries/postgres/generateSalesData/getDateEndPerWeek')
const {
  getAllFgSalesTotalsRow,
  getAllFgSalesColTotals,
  getFgProgramTotalsRow,
  getFgProgramTotalsCol,
  getFgSpeciesGroupTotalsRow,
  getFgSpeciesGroupTotalsCol,
} = require('../queries/postgres/getSales/byProgram/trend')

const {
  getFgInTransitByProgram,
  getFgAtLocationByProgram,
  getFgInTransitBySpecies,
  getFgAtLocationBySepcies,
  getFgTotal,
  getFgInTransitTotal,
  getFgAtLocationTotal,
} = require('../queries/postgres/getInven/byProgram/getFgInvenByProgram')

const { getFgByFreshFrozen, getFgByProcessingLevel } = require('../queries/postgres/getInven/forProgFfpds/getFgInven')

const {
  getRmByProgram,
  getRmInTransitByProgram,
  getRmAtLocationByProgram,
  getRmBySpecies,
  getRmInTransitBySpecies,
  getRmAtLocationBySepcies,
  getRmTotal,
  getRmInTransitTotal,
  getRmAtLocationTotal,
} = require('../queries/postgres/getInven/byProgram/getRmInvenByProgram')

const {
  getFgOnOrderByProgram,
  getFgOnOrderBySpecies,
  getFgOnOrderTotal,
} = require('../queries/postgres/getPurchOrders/byProgram/getFgOpenPoByProgram')

const {
  getRmOnOrderByProgram,
  getRmOnOrderBySpecies,
  getRmOnOrderTotal,
} = require('../queries/postgres/getPurchOrders/byProgram/getRmOpenPoByProgram')
const {
  getFgSalesOrdersByProgram,
  getFgSalesOrdersBySpecies,
  getFgSalesOrdersTotal,
} = require('../queries/postgres/getSalesOrders/getSoByProgram')

const { getSpeciesGroupSubProgram } = require('../queries/postgres/getRows/byProgram/getSpeciesGroupSubProgram')
const { getSpeciesGroupSubTotal } = require('../queries/postgres/getRows/byProgram/getSpeciesGroupSubTotal')

const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapSalesToRowTemplates = require('../models/mapSalesToRowTemplates')
const mapInvenToRowTemplates = require('../models/mapInvenToRowTemplates')
const combineMappedRows = require('../models/combineMappedRows')
const cleanLabelsForDisplay = require('../models/cleanLabelsForDiplay')

const getWeeklyProgramSalesFfpds = async (start, end, program) => {
  ///////////////////////////////// INVENTORY DATA

  /* TOTAL FG */
  const fgByFreshFrozen = await getFgByFreshFrozen(program) // Grouped By Fresh/Frozen (1st level)
  const fgByProcessinglevel = await getFgByProcessingLevel() // Grouped By Processed/Dry, Fresh/Frozen (2nd Level)

  return { fgByProcessinglevel, fgByFreshFrozen }

  const fgBySpecies = await getFgBySpecies() // Grouped Size, Fresh/Frozen, Processed/Dry (3rd Level)
  const fgTotal = await getFgTotal() // Total For Program

  /* FG IN TRANSIT*/
  const fgInTransitByProgram = await getFgInTransitByProgram()
  const fgInTransitBySpecies = await getFgInTransitBySpecies()
  const fgInTransitTotal = await getFgInTransitTotal()

  /* FG ON HAND (LESS IN TRANSIT) */
  const fgAtLocationByProgram = await getFgAtLocationByProgram()
  const fgAtLocationBySepcies = await getFgAtLocationBySepcies()
  const fgAtLocationTotal = await getFgAtLocationTotal()

  /* FG ON ORDER */
  const fgOnOrderByProgram = await getFgOnOrderByProgram()
  const fgOnOrderBySpecies = await getFgOnOrderBySpecies()
  const fgOnOrderTotal = await getFgOnOrderTotal()

  /* TOTAL RM */
  const rmByProgram = await getRmByProgram()
  const rmBySpecies = await getRmBySpecies()
  const rmTotal = await getRmTotal()

  /* RM IN TRANSIT (OUT COUNTRY PLUS IN TRANSIT) */
  const rmInTransitByProgram = await getRmInTransitByProgram()
  const rmInTransitBySpecies = await getRmInTransitBySpecies()
  const rmInTransitTotal = await getRmInTransitTotal()

  /* RM ON HAND (IN COUNTRY LESS IN TRANSIT) */
  const rmAtLocationByProgram = await getRmAtLocationByProgram()
  const rmAtLocationBySepcies = await getRmAtLocationBySepcies()
  const rmAtLocationTotal = await getRmAtLocationTotal()

  /* RM ON ORDER */
  const rmOnOrderByProgram = await getRmOnOrderByProgram()
  const rmOnOrderBySpecies = await getRmOnOrderBySpecies()
  const rmOnOrderTotal = await getRmOnOrderTotal()

  ///////////////////////////////// SALES ORDERS
  const fgSalesOrdersByProgram = await getFgSalesOrdersByProgram()
  const fgSalesOrdersBySpecies = await getFgSalesOrdersBySpecies()
  const fgSalesOrdersTotal = await getFgSalesOrdersTotal()

  ///////////////////////////////// SALES DATA

  const fgProgramTotalsRow = await getFgProgramTotalsRow(start, end)
  /*
  "fgProgramTotalsRow": [
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

  const fgProgramTotalsCol = await getFgProgramTotalsCol(start, end)
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
            "column": "2022-W01",
            "maj_row": "COD",
            "min_row": "SUBTOTAL",
            "lbs": 171680,
            "sales": 1032377.9500000001,
            "cogs": 933861.4599999998,
            "othp": 43566.97999999999
        },
        {
            "column": "2022-W01",
            "maj_row": "FLATFISH",
            "min_row": "SUBTOTAL",
            "lbs": 112358.6992,
            "sales": 525812.1299999999,
            "cogs": 444937.04,
            "othp": 26592.37999999999
        },
        {
            "column": "2022-W01",
            "maj_row": "HADDOCK",
            "min_row": "SUBTOTAL",
            "lbs": 141900,
            "sales": 537393.2000000001,
            "cogs": 434112.64,
            "othp": 1772.0499999999936
        },
         
    */

  const fgSpeciesGroupTotalsCol = await getFgSpeciesGroupTotalsCol(start, end)
  /*
      "fgSpeciesGroupTotalsCol": [
         {
            "column": "TOTAL",
            "maj_row": "COD",
            "min_row": "SUBTOTAL",
            "lbs": 7557337.6252,
            "sales": 42913641.75999999,
            "cogs": 39311139.310000114,
            "othp": 1457434.5500000026
        },
        {
            "column": "TOTAL",
            "maj_row": "FLATFISH",
            "min_row": "SUBTOTAL",
            "lbs": 13091682.343000002,
            "sales": 49169337.72000003,
            "cogs": 39366764.52,
            "othp": 2775694.96
        },
           
      */

  ///////////////////////////////// ROWS

  const speciesGroupSubProgram = await getSpeciesGroupSubProgram(start, end)

  const speciesGroupSubTotal = await getSpeciesGroupSubTotal(start, end)

  const totalsRow = [{ maj_row: 'FG SALES', min_row: 'TOTAL' }]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...speciesGroupSubProgram, ...speciesGroupSubTotal]
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

  rowTemplate.push(...totalsRow)

  // map data into row template
  const rowTemplate_unflat = unflattenRowTemplate(rowTemplate)
  /*
        {
        "COD-COD CHN": {
            "maj_row": "COD",
            "min_row": "COD CHN"
        },
        "COD-COD USA": {
            "maj_row": "COD",
            "min_row": "COD USA"
        },
        "COD-SUBTOTAL": {
            "maj_row": "COD",
            "min_row": "SUBTOTAL"
        },
        "FLATFISH-FLATFISH CHN": {
            "maj_row": "FLATFISH",
            "min_row": "FLATFISH CHN"
        },
  */

  const mappedSales = mapSalesToRowTemplates(
    [
      ...fgProgramTotalsRow,
      ...fgProgramTotalsCol,
      ...allSalesRowTotals,
      ...allSalesColTotals,
      ...fgSpeciesGroupTotalsRow,
      ...fgSpeciesGroupTotalsCol,
      ...fgSalesOrdersByProgram,
      ...fgSalesOrdersBySpecies,
      ...fgSalesOrdersTotal,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...fgByProgram,
      ...fgInTransitByProgram,
      ...fgAtLocationByProgram,
      ...fgBySpecies,
      ...fgInTransitBySpecies,
      ...fgAtLocationBySepcies,
      ...fgTotal,
      ...fgInTransitTotal,
      ...fgAtLocationTotal,
      ...fgOnOrderByProgram,
      ...fgOnOrderBySpecies,
      ...fgOnOrderTotal,
      ...rmByProgram,
      ...rmInTransitByProgram,
      ...rmAtLocationByProgram,
      ...rmBySpecies,
      ...rmInTransitBySpecies,
      ...rmAtLocationBySepcies,
      ...rmTotal,
      ...rmInTransitTotal,
      ...rmAtLocationTotal,
      ...rmOnOrderByProgram,
      ...rmOnOrderBySpecies,
      ...rmOnOrderTotal,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)

  /*
  mappedSales
{
 "COD-COD CHN": {
      "maj_row": "COD",
      "min_row": "COD CHN",
      "2022-W01": {
          "weight": -3660,
          "revenue": -17245,
          "cogs": -13828.28,
          "othp": 100.27,
          "netSales": -17345.27,
          "grossMargin": -3516.99,
          "revenuePerLb": 4.71,
          "cogsPerLb": 3.78,
          "othpPerLb": -0.03,
          "netSalesPerLb": 4.74,
          "grossMarginPerLb": 0.96
      },
      "2022-W02": {
          "weight": 35178,
          "revenue": 116087.4,
          "cogs": 110577.4,
          "othp": 534.71,
          "netSales": 115552.69,
          "grossMargin": 4975.29,
          "revenuePerLb": 3.3,
          "cogsPerLb": 3.14,
          "othpPerLb": 0.02,
          "netSalesPerLb": 3.28,
          "grossMarginPerLb": 0.14
      },
  */

  // clean out rows with zero sales
  Object.keys(mappedData).forEach(key => {
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)

  // remove row labels for maj_row except first row of each grouping
  const finalData = cleanLabelsForDisplay(flattenedMappedData)

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
  return { data: finalData, cols: dataCols }
}

module.exports = getWeeklyProgramSalesFfpds
