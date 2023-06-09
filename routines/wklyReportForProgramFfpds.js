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
  getlvl_2_subtotal_fgInTransit,
  getFgAtLocationByProgram,
  getFgInTransitBySpecies,
  getFgAtLocationBySepcies,
} = require('../queries/postgres/getInven/byProgram/getFgInvenByProgram')

const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  lvl_2_subtotal_getFgInTransit,
  lvl_3_detail_getFgInven,
  dataTotal_getFgInven,
  dataTotal_getFgInTransit,
  dataTotal_getFgAtLocation,
} = require('../queries/postgres/getInven/forProgFfpds/getFgInven')

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

const {
  getRowsThirdLevelDetail,
  getRowsSecondLevelDetail,
  getRowsFirstLevelDetail,
} = require('../queries/postgres/getRows/forProgFfpds/rowsByDetailLevel')

const unflattenRowTemplate = require('../models/unflattenRowTemplate')
const mapSalesToRowTemplates = require('../models/mapSalesToRowTemplates')
const mapInvenToRowTemplates = require('../models/mapInvenToRowTemplatesThreeLevel')
const combineMappedRows = require('../models/combineMappedRows')
const cleanLabelsForDisplay = require('../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')

const labelCols = require('../queries/hardcode/ffpdsCols')

const getWeeklyProgramSalesFfpds = async (start, end, program) => {
  ///////////////////////////////// INVENTORY DATA

  /* TOTAL FG (FG) */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(program) // Grouped By Fresh/Frozen (1st level)
  const lvl_2_subtotal_fgInven = await lvl_2_subtotal_getFgInven(program) // Grouped By Processed/Dry, Fresh/Frozen (2nd Level)
  const lvl_3_detail_fgInven = await lvl_3_detail_getFgInven(program) // Grouped Size, Fresh/Frozen, Processed/Dry (3rd Level)
  const dataTotal_fgInven = await dataTotal_getFgInven(program) // Total For Program

  // /* FG IN TRANSIT*/
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit()
  // const fgInTransitBySpecies = await getFgInTransitBySpecies()
  const dataTotal_fgInTransit = await dataTotal_getFgInTransit(program)

  // /* FG ON HAND (LESS IN TRANSIT) */
  // const fgAtLocationByProgram = await getFgAtLocationByProgram()
  // const fgAtLocationBySepcies = await getFgAtLocationBySepcies()
  const dataTotal_fgAtLocation = await dataTotal_getFgAtLocation(program)

  // /* FG ON ORDER */
  // const fgOnOrderByProgram = await getFgOnOrderByProgram()
  // const fgOnOrderBySpecies = await getFgOnOrderBySpecies()
  // const fgOnOrderTotal = await getFgOnOrderTotal()

  // /* TOTAL RM */
  // const rmByProgram = await getRmByProgram()
  // const rmBySpecies = await getRmBySpecies()
  // const rmTotal = await getRmTotal()

  // /* RM IN TRANSIT (OUT COUNTRY PLUS IN TRANSIT) */
  // const rmInTransitByProgram = await getRmInTransitByProgram()
  // const rmInTransitBySpecies = await getRmInTransitBySpecies()
  // const rmInTransitTotal = await getRmInTransitTotal()

  // /* RM ON HAND (IN COUNTRY LESS IN TRANSIT) */
  // const rmAtLocationByProgram = await getRmAtLocationByProgram()
  // const rmAtLocationBySepcies = await getRmAtLocationBySepcies()
  // const rmAtLocationTotal = await getRmAtLocationTotal()

  // /* RM ON ORDER */
  // const rmOnOrderByProgram = await getRmOnOrderByProgram()
  // const rmOnOrderBySpecies = await getRmOnOrderBySpecies()
  // const rmOnOrderTotal = await getRmOnOrderTotal()

  // ///////////////////////////////// SALES ORDERS
  // const fgSalesOrdersByProgram = await getFgSalesOrdersByProgram()
  // const fgSalesOrdersBySpecies = await getFgSalesOrdersBySpecies()
  // const fgSalesOrdersTotal = await getFgSalesOrdersTotal()

  // ///////////////////////////////// SALES DATA

  // const fgProgramTotalsRow = await getFgProgramTotalsRow(start, end)
  // /*
  // "fgProgramTotalsRow": [
  //        {
  //       "column": "2022-W01",
  //       "l1_subtotal": "COD",
  //       "l2_subtotal": "COD CHN",
  //       "lbs": -3660,
  //       "sales": -17245,
  //       "cogs": -13828.28,
  //       "othp": 100.26999999999998
  //   },
  //   {
  //       "column": "2022-W01",
  //       "l1_subtotal": "COD",
  //       "l2_subtotal": "COD USA",
  //       "lbs": 175340,
  //       "sales": 1049622.9500000002,
  //       "cogs": 947689.7399999995,
  //       "othp": 43466.70999999999
  //   },
  //   {
  //       "column": "2022-W01",
  //       "l1_subtotal": "FLATFISH",
  //       "l2_subtotal": "FLATFISH CHN",
  //       "lbs": 35789.6992,
  //       "sales": 149061.13,
  //       "cogs": 98996.8,
  //       "othp": 12357.330000000002
  //   },
  // */

  // const fgProgramTotalsCol = await getFgProgramTotalsCol(start, end)
  // /*
  // "getFgProgramTotalsCol": [
  //   {
  //       "column": "TOTAL",
  //       "l1_subtotal": "COD",
  //       "l2_subtotal": "COD CHN",
  //       "lbs": 1470740.428,
  //       "sales": 6951255.52,
  //       "cogs": 5739432.030000001,
  //       "othp": 183559.57999999984
  //   },
  //   {
  //       "column": "TOTAL",
  //       "l1_subtotal": "COD",
  //       "l2_subtotal": "COD USA",
  //       "lbs": 6086597.197199999,
  //       "sales": 35962386.23999998,
  //       "cogs": 33571707.27999995,
  //       "othp": 1273874.97
  //   },
  //   {
  //       "column": "TOTAL",
  //       "l1_subtotal": "FLATFISH",
  //       "l2_subtotal": "FLATFISH CHN",
  //       "lbs": 9605545.717999998,
  //       "sales": 31481754.21999999,
  //       "cogs": 24343992.249999963,
  //       "othp": 2016905.8899999987
  //   },
  // */

  // const allSalesRowTotals = await getAllFgSalesTotalsRow(start, end)
  // /*
  // "allSalesRowTotals": [
  //   {
  //       "column": "2022-W01",
  //       "l1_subtotal": "FG SALES",
  //       "l2_subtotal": "TOTAL",
  //       "lbs": 570530.4892000001,
  //       "sales": 3650605.8999999985,
  //       "cogs": 3154600.519999998,
  //       "othp": 86901.38
  //   },
  //   {
  //       "column": "2022-W02",
  //       "l1_subtotal": "FG SALES",
  //       "l2_subtotal": "TOTAL",
  //       "lbs": 725587.9219999999,
  //       "sales": 5625076.049999998,
  //       "cogs": 4899364.590000003,
  //       "othp": 100527.69999999998
  //   },
  //   {
  //       "column": "2022-W03",
  //       "l1_subtotal": "FG SALES",
  //       "l2_subtotal": "TOTAL",
  //       "lbs": 536702.5416000001,
  //       "sales": 4145706.939999997,
  //       "cogs": 3630620.0600000024,
  //       "othp": 90319.32
  //   },
  // */

  // const allSalesColTotals = await getAllFgSalesColTotals(start, end)
  // /*
  // "allSalesRowTotals": [
  //       {
  //       "column": "TOTAL",
  //       "l1_subtotal": "FG SALES",
  //       "l2_subtotal": "TOTAL",
  //       "lbs": 31948279.458400007,
  //       "sales": 205632410.27000064,
  //       "cogs": 176277047.73999837,
  //       "othp": 5897058.769999918
  //   }

  // */

  // const fgSpeciesGroupTotalsRow = await getFgSpeciesGroupTotalsRow(start, end)
  // /*
  //   "fgSpeciesGroupTotalsRow": [
  //       {
  //           "column": "2022-W01",
  //           "l1_subtotal": "COD",
  //           "l2_subtotal": "SUBTOTAL",
  //           "lbs": 171680,
  //           "sales": 1032377.9500000001,
  //           "cogs": 933861.4599999998,
  //           "othp": 43566.97999999999
  //       },
  //       {
  //           "column": "2022-W01",
  //           "l1_subtotal": "FLATFISH",
  //           "l2_subtotal": "SUBTOTAL",
  //           "lbs": 112358.6992,
  //           "sales": 525812.1299999999,
  //           "cogs": 444937.04,
  //           "othp": 26592.37999999999
  //       },
  //       {
  //           "column": "2022-W01",
  //           "l1_subtotal": "HADDOCK",
  //           "l2_subtotal": "SUBTOTAL",
  //           "lbs": 141900,
  //           "sales": 537393.2000000001,
  //           "cogs": 434112.64,
  //           "othp": 1772.0499999999936
  //       },

  //   */

  // const fgSpeciesGroupTotalsCol = await getFgSpeciesGroupTotalsCol(start, end)
  // /*
  //     "fgSpeciesGroupTotalsCol": [
  //        {
  //           "column": "TOTAL",
  //           "l1_subtotal": "COD",
  //           "l2_subtotal": "SUBTOTAL",
  //           "lbs": 7557337.6252,
  //           "sales": 42913641.75999999,
  //           "cogs": 39311139.310000114,
  //           "othp": 1457434.5500000026
  //       },
  //       {
  //           "column": "TOTAL",
  //           "l1_subtotal": "FLATFISH",
  //           "l2_subtotal": "SUBTOTAL",
  //           "lbs": 13091682.343000002,
  //           "sales": 49169337.72000003,
  //           "cogs": 39366764.52,
  //           "othp": 2775694.96
  //       },

  //     */

  //

  ///////////////////////////////// ROWS

  const rowsThirdLevelDetail = await getRowsThirdLevelDetail(start, end, program)
  const rowsSecondLevelDetail = await getRowsSecondLevelDetail(start, end, program)
  const rowsFirstLevelDetail = await getRowsFirstLevelDetail(start, end, program)
  const totalsRow = [{ l1_subtotal: 'FG SALES', l2_subtotal: 'TOTAL', l3_detail: 'TOTAL' }]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsThirdLevelDetail, ...rowsSecondLevelDetail, ...rowsFirstLevelDetail]
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_detail.includes('TOTAL')) return 1
      if (b.l3_detail.includes('TOTAL')) return -1

      if (a.l3_detail < b.l3_detail) return -1
      if (a.l3_detail > b.l3_detail) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_subtotal.includes('TOTAL')) return 1
      if (b.l2_subtotal.includes('TOTAL')) return -1

      if (a.l2_subtotal < b.l2_subtotal) return -1
      if (a.l2_subtotal > b.l2_subtotal) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_subtotal.includes('TOTAL')) return 1
      if (b.l1_subtotal.includes('TOTAL')) return -1

      if (a.l1_subtotal < b.l1_subtotal) return -1
      if (a.l1_subtotal > b.l1_subtotal) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_subtotal',
    2: 'l2_subtotal',
    3: 'l3_detail',
  })
  /*
        {
        "COD-COD CHN": {
            "l1_subtotal": "COD",
            "l2_subtotal": "COD CHN"
        },
        "COD-COD USA": {
            "l1_subtotal": "COD",
            "l2_subtotal": "COD USA"
        },
        "COD-SUBTOTAL": {
            "l1_subtotal": "COD",
            "l2_subtotal": "SUBTOTAL"
        },
        "FLATFISH-FLATFISH CHN": {
            "l1_subtotal": "FLATFISH",
            "l2_subtotal": "FLATFISH CHN"
        },
  */

  // const mappedSales = mapSalesToRowTemplates(
  //   [
  //     ...fgProgramTotalsRow,
  //     ...fgProgramTotalsCol,
  //     ...allSalesRowTotals,
  //     ...allSalesColTotals,
  //     ...fgSpeciesGroupTotalsRow,
  //     ...fgSpeciesGroupTotalsCol,
  //     ...fgSalesOrdersByProgram,
  //     ...fgSalesOrdersBySpecies,
  //     ...fgSalesOrdersTotal,
  //   ],
  //   rowTemplate_unflat
  // )

  // const mappedInven = mapInvenToRowTemplates(
  //   [
  //     ...fgByProgram,
  //     ...lvl_2_subtotal_fgInTransit,
  //     ...fgAtLocationByProgram,
  //     ...fgBySpecies,
  //     ...fgInTransitBySpecies,
  //     ...fgAtLocationBySepcies,
  //     ...dataTotal_fgInven,
  //     ...dataTotal_fgInTransit,
  //     ...dataTotal_fgAtLocation,
  //     ...fgOnOrderByProgram,
  //     ...fgOnOrderBySpecies,
  //     ...fgOnOrderTotal,
  //     ...rmByProgram,
  //     ...rmInTransitByProgram,
  //     ...rmAtLocationByProgram,
  //     ...rmBySpecies,
  //     ...rmInTransitBySpecies,
  //     ...rmAtLocationBySepcies,
  //     ...rmTotal,
  //     ...rmInTransitTotal,
  //     ...rmAtLocationTotal,
  //     ...rmOnOrderByProgram,
  //     ...rmOnOrderBySpecies,
  //     ...rmOnOrderTotal,
  //   ],
  //   rowTemplate_unflat
  // )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_2_subtotal_fgInven,
      ...lvl_2_subtotal_fgInTransit,
      ...lvl_3_detail_fgInven,
      ...dataTotal_fgInven,
      ...dataTotal_fgInTransit,
      ...dataTotal_fgAtLocation,
    ],
    rowTemplate_unflat
  )

  const mappedData = mappedInven // For testing ************* so remainder of routine works

  //   const mappedData = combineMappedRows(mappedSales, mappedInven)

  //   /*
  //   mappedSales
  // {
  //  "COD-COD CHN": {
  //       "l1_subtotal": "COD",
  //       "l2_subtotal": "COD CHN",
  //       "2022-W01": {
  //           "weight": -3660,
  //           "revenue": -17245,
  //           "cogs": -13828.28,
  //           "othp": 100.27,
  //           "netSales": -17345.27,
  //           "grossMargin": -3516.99,
  //           "revenuePerLb": 4.71,
  //           "cogsPerLb": 3.78,
  //           "othpPerLb": -0.03,
  //           "netSalesPerLb": 4.74,
  //           "grossMarginPerLb": 0.96
  //       },
  //       "2022-W02": {
  //           "weight": 35178,
  //           "revenue": 116087.4,
  //           "cogs": 110577.4,
  //           "othp": 534.71,
  //           "netSales": 115552.69,
  //           "grossMargin": 4975.29,
  //           "revenuePerLb": 3.3,
  //           "cogsPerLb": 3.14,
  //           "othpPerLb": 0.02,
  //           "netSalesPerLb": 3.28,
  //           "grossMarginPerLb": 0.14
  //       },
  //   */

  // clean out rows with zero sales

  // TEMPORARY CLEAN OUT FUNCTION ***********************
  Object.keys(mappedData).forEach(key => {
    if (typeof mappedData[key]['FG INVEN'] === 'undefined') {
      delete mappedData[key]
    }
  })

  // Object.keys(mappedData).forEach(key => {
  //   if (Object.keys(mappedData[key]).length === 1) {
  //     delete mappedData[key]
  //   }
  // })

  const flattenedMappedData = Object.values(mappedData)

  // remove row labels for l1_subtotal AND l2_subtotal except first row of each grouping
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
  return { data: finalData, cols: dataCols, labelCols: labelCols }
}

module.exports = getWeeklyProgramSalesFfpds
