const { getDateEndPerWeekByRange } = require('../../../generateSales/queries/postgres/getDateEndPerWeek')
// const {
//   getAllFgSalesTotalsRow,
//   getAllFgSalesColTotals,
//   getFgProgramTotalsRow,
//   getFgProgramTotalsCol,
//   getFgSpeciesGroupTotalsRow,
//   getFgSpeciesGroupTotalsCol,
// } = require('../../queries/postgres/getSales/byProgram/trend')

const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  lvl_3_detail_getFgInven,
  dataTotal_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_2_subtotal_getFgInTransit,
  lvl_3_detail_getFgInTransit,
  dataTotal_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_2_subtotal_getFgAtLoc,
  lvl_3_detail_getFgAtLoc,
  dataTotal_getFgAtLocation,
} = require('../queries/hardcode/postgres/getFgInven')

// const {
//   getRmByProgram,
//   getRmInTransitByProgram,
//   getRmAtLocationByProgram,
//   getRmBySpecies,
//   getRmInTransitBySpecies,
//   getRmAtLocationBySepcies,
//   getRmTotal,
//   getRmInTransitTotal,
//   getRmAtLocationTotal,
// } = require('../../queries/postgres/getInven/byProgram/getRmInvenByProgram')

// const {
//   getFgOnOrderByProgram,
//   getFgOnOrderBySpecies,
//   getFgOnOrderTotal,
// } = require('../../queries/postgres/getPurchOrders/byProgram/getFgOpenPoByProgram')

// const {
//   getRmOnOrderByProgram,
//   getRmOnOrderBySpecies,
//   getRmOnOrderTotal,
// } = require('../../queries/postgres/getPurchOrders/byProgram/getRmOpenPoByProgram')
// const {
//   getFgSalesOrdersByProgram,
//   getFgSalesOrdersBySpecies,
//   getFgSalesOrdersTotal,
// } = require('../../queries/postgres/getSalesOrders/getSoByProgram')

const { getRowsThirdLevelDetail, getRowsSecondLevelDetail, getRowsFirstLevelDetail } = require('../queries/hardcode/postgres/getRows')

// const unflattenRowTemplate = require('../../../models/unflattenRowTemplate')
// const mapSalesToRowTemplates = require('../../../models/mapSalesToRowTemplates')
const mapInvenToRowTemplates = require('../../models/mapInvenToRowTemplatesThreeLevel')
// const combineMappedRows = require('../../../models/combineMappedRows')
const cleanLabelsForDisplay = require('../../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../models/unflattenByCompositKey')

const labelCols = require('../queries/hardcode/cols')

const getWeeklyProgramSalesFfpds = async (start, end, program) => {
  ///////////////////////////////// INVENTORY DATA

  /* TOTAL FG (FG) */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(program)
  const lvl_2_subtotal_fgInven = await lvl_2_subtotal_getFgInven(program)
  const lvl_3_detail_fgInven = await lvl_3_detail_getFgInven(program)
  const dataTotal_fgInven = await dataTotal_getFgInven(program)

  // /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit(program)
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit(program)
  const lvl_3_detail_fgInTransit = await lvl_3_detail_getFgInTransit(program)
  const dataTotal_fgInTransit = await dataTotal_getFgInTransit(program)

  // /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc(program)
  const lvl_2_subtotal_fgAtLoc = await lvl_2_subtotal_getFgAtLoc(program)
  const lvl_3_detail_fgAtLoc = await lvl_3_detail_getFgAtLoc(program)
  const dataTotal_fgAtLocation = await dataTotal_getFgAtLocation(program)

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

  // /* FG ON ORDER */
  // const fgOnOrderByProgram = await getFgOnOrderByProgram()
  // const fgOnOrderBySpecies = await getFgOnOrderBySpecies()
  // const fgOnOrderTotal = await getFgOnOrderTotal()

  // ///////////////////////////////// SALES ORDERS
  // const fgSalesOrdersByProgram = await getFgSalesOrdersByProgram()
  // const fgSalesOrdersBySpecies = await getFgSalesOrdersBySpecies()
  // const fgSalesOrdersTotal = await getFgSalesOrdersTotal()

  // ///////////////////////////////// SALES DATA

  // const fgProgramTotalsRow = await getFgProgramTotalsRow(start, end)
  // const fgProgramTotalsCol = await getFgProgramTotalsCol(start, end)
  // const allSalesRowTotals = await getAllFgSalesTotalsRow(start, end)
  // const allSalesColTotals = await getAllFgSalesColTotals(start, end)
  // const fgSpeciesGroupTotalsRow = await getFgSpeciesGroupTotalsRow(start, end)
  // const fgSpeciesGroupTotalsCol = await getFgSpeciesGroupTotalsCol(start, end)

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
  //     ...lvl_2_subtotal_fgAtLoc,
  //     ...fgBySpecies,
  //     ...lvl_1_subtotal_fgInTransit,
  //     ...lvl_1_subtotal_fgAtLoc,
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
      ...lvl_3_detail_fgInven,
      ...dataTotal_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_2_subtotal_fgInTransit,
      ...lvl_3_detail_fgInTransit,
      ...dataTotal_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_2_subtotal_fgAtLoc,
      ...lvl_3_detail_fgAtLoc,
      ...dataTotal_fgAtLocation,
    ],
    rowTemplate_unflat
  )

  const mappedData = mappedInven // For testing ************* so remainder of routine works

  //   const mappedData = combineMappedRows(mappedSales, mappedInven)

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

  // return
  return { data: finalData, cols: dataCols, labelCols: labelCols }
}

module.exports = getWeeklyProgramSalesFfpds
