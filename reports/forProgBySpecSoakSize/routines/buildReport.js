const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../shared/queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols } = require('../../shared/queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../../shared/queries/postgres/getSoDates')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_2_subtotal_getSalesByWk,
  lvl_3_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_2_subtotal_getSalesPeriodToDate,
  lvl_3_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../queries/postgres/getSalesTrend')
const {
  lvl_1_subtotal_getSalesByFy,
  lvl_2_subtotal_getSalesByFy,
  lvl_3_subtotal_getSalesByFy,
  lvl_0_total_getSalesByFy,
} = require('../queries/postgres/getSalesTrendByFy')
const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  lvl_3_subtotal_getFgInven,
  lvl_0_total_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_2_subtotal_getFgInTransit,
  lvl_3_subtotal_getFgInTransit,
  lvl_0_total_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_2_subtotal_getFgAtLoc,
  lvl_3_subtotal_getFgAtLoc,
  lvl_0_total_getFgAtLoc,
  lvl_1_subtotal_getFgAtLoc_untagged,
  lvl_2_subtotal_getFgAtLoc_untagged,
  lvl_3_subtotal_getFgAtLoc_untagged,
  lvl_0_total_getFgAtLoc_untagged,
  lvl_1_subtotal_getFgAtLoc_tagged,
  lvl_2_subtotal_getFgAtLoc_tagged,
  lvl_3_subtotal_getFgAtLoc_tagged,
  lvl_0_total_getFgAtLoc_tagged,
} = require('../queries/postgres/getFgInven')
const {
  lvl_3_subtotal_getRmInven,
  lvl_3_subtotal_getRmInTransit,
  lvl_3_subtotal_getRmAtLoc,
  lvl_2_subtotal_getRmInven,
  lvl_2_subtotal_getRmInTransit,
  lvl_2_subtotal_getRmAtLoc,
  lvl_1_subtotal_getRmInven,
  lvl_1_subtotal_getRmInTransit,
  lvl_1_subtotal_getRmAtLoc,
  lvl_0_total_getRmInven,
  lvl_0_total_getRmInTransit,
  lvl_0_total_getRmAtLoc,
} = require('../queries/postgres/getRmInven')
const {
  lvl_1_subtotal_getFgPo,
  lvl_2_subtotal_getFgPo,
  lvl_3_subtotal_getFgPo,
  lvl_0_total_getFgPo,
} = require('../queries/postgres/getFgOpenPo')
const {
  lvl_1_subtotal_getRmPo,
  lvl_2_subtotal_getRmPo,
  lvl_3_subtotal_getRmPo,
  lvl_0_total_getRmPo,
} = require('../queries/postgres/getRmOpenPo')
const {
  lvl_1_subtotal_getSo,
  lvl_2_subtotal_getSo,
  lvl_3_subtotal_getSo,
  lvl_0_total_getSo,
  lvl_1_subtotal_getSoTagged,
  lvl_2_subtotal_getSoTagged,
  lvl_3_subtotal_getSoTagged,
  lvl_0_total_getSoTagged,
  lvl_1_subtotal_getSoUntagged,
  lvl_2_subtotal_getSoUntagged,
  lvl_3_subtotal_getSoUntagged,
  lvl_0_total_getSoUntagged,
} = require('../queries/postgres/getSo')
const {
  lvl_1_subtotal_getSo_byWk,
  lvl_2_subtotal_getSo_byWk,
  lvl_3_subtotal_getSo_byWk,
  lvl_0_total_getSo_byWk,
  lvl_1_subtotal_getSoTagged_byWk,
  lvl_2_subtotal_getSoTagged_byWk,
  lvl_3_subtotal_getSoTagged_byWk,
  lvl_0_total_getSoTagged_byWk,
  lvl_1_subtotal_getSoUntagged_byWk,
  lvl_2_subtotal_getSoUntagged_byWk,
  lvl_3_subtotal_getSoUntagged_byWk,
  lvl_0_total_getSoUntagged_byWk,
} = require('../queries/postgres/getSoByWeek')
const { getRowsThirdLevelDetail, getRowsSecondLevelDetail, getRowsFirstLevelDetail } = require('../queries/postgres/getRows')
const {
  getRowsThirdLevelDetail: getRows_l3_showFyTrend,
  getRowsSecondLevelDetail: getRows_l2_showFyTrend,
  getRowsFirstLevelDetail: getRows_l1_showFyTrend,
} = require('../queries/postgres/getRowsTrendByFy')

const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesThreeLevel')
const mapInvenToRowTemplates = require('../../shared/models/mapInvenToRowTemplatesThreeLevel')
const combineMappedRows = require('../../shared/models/combineMappedRows')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../shared/models/unflattenByCompositKey')

const labelCols = require('../queries/hardcode/cols')

const buildReport = async (start, end, program, showFyTrend) => {
  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(program)
  const lvl_2_subtotal_fgInven = await lvl_2_subtotal_getFgInven(program)
  const lvl_3_subtotal_fgInven = await lvl_3_subtotal_getFgInven(program)
  const lvl_0_total_fgInven = await lvl_0_total_getFgInven(program)
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit(program)
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit(program)
  const lvl_3_subtotal_fgInTransit = await lvl_3_subtotal_getFgInTransit(program)
  const lvl_0_total_fgInTransit = await lvl_0_total_getFgInTransit(program)
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc(program)
  const lvl_2_subtotal_fgAtLoc = await lvl_2_subtotal_getFgAtLoc(program)
  const lvl_3_subtotal_fgAtLoc = await lvl_3_subtotal_getFgAtLoc(program)
  const lvl_0_total_fgAtLoc = await lvl_0_total_getFgAtLoc(program)
  /* FG ON HAND UNTAGGED */
  const lvl_1_subtotal_fgAtLoc_untagged = await lvl_1_subtotal_getFgAtLoc_untagged(program)
  const lvl_2_subtotal_fgAtLoc_untagged = await lvl_2_subtotal_getFgAtLoc_untagged(program)
  const lvl_3_subtotal_fgAtLoc_untagged = await lvl_3_subtotal_getFgAtLoc_untagged(program)
  const lvl_0_total_fgAtLoc_untagged = await lvl_0_total_getFgAtLoc_untagged(program)
  /* FG ON HAND TAGGED */
  // const lvl_1_subtotal_fgAtLoc_tagged = await lvl_1_subtotal_getFgAtLoc_tagged(program)
  // const lvl_2_subtotal_fgAtLoc_tagged = await lvl_2_subtotal_getFgAtLoc_tagged(program)
  // const lvl_3_subtotal_fgAtLoc_tagged = await lvl_3_subtotal_getFgAtLoc_tagged(program)
  // const lvl_0_total_fgAtLoc_tagged = await lvl_0_total_getFgAtLoc_tagged(program)

  /* TOTAL RM */
  // const lvl_1_subtotal_rmInven = await lvl_1_subtotal_getRmInven(program)
  // const lvl_2_subtotal_rmInven = await lvl_2_subtotal_getRmInven(program)
  // const lvl_3_subtotal_rmInven = await lvl_3_subtotal_getRmInven(program)
  // const lvl_0_total_rmInven = await lvl_0_total_getRmInven(program)
  /* RM IN TRANSIT (OUT COUNTRY PLUS IN TRANSIT) */
  // const lvl_1_subtotal_rmInTransit = await lvl_1_subtotal_getRmInTransit(program)
  // const lvl_2_subtotal_rmInTransit = await lvl_2_subtotal_getRmInTransit(program)
  // const lvl_3_subtotal_rmInTransit = await lvl_3_subtotal_getRmInTransit(program)
  // const lvl_0_total_rmInTransit = await lvl_0_total_getRmInTransit(program)
  /* RM ON HAND (IN COUNTRY LESS IN TRANSIT) */
  // const lvl_1_subtotal_rmAtLoc = await lvl_1_subtotal_getRmAtLoc(program)
  // const lvl_2_subtotal_rmAtLoc = await lvl_2_subtotal_getRmAtLoc(program)
  // const lvl_3_subtotal_rmAtLoc = await lvl_3_subtotal_getRmAtLoc(program)
  // const lvl_0_total_rmAtLoc = await lvl_0_total_getRmAtLoc(program)
  /* RM ON ORDER */
  // const lvl_1_subtotal_rmPo = await lvl_1_subtotal_getRmPo(program)
  // const lvl_2_subtotal_rmPo = await lvl_2_subtotal_getRmPo(program)
  // const lvl_3_subtotal_rmPo = await lvl_3_subtotal_getRmPo(program)
  // const lvl_0_total_rmPo = await lvl_0_total_getRmPo(program)

  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo(program)
  const lvl_2_subtotal_fgPo = await lvl_2_subtotal_getFgPo(program)
  const lvl_3_subtotal_fgPo = await lvl_3_subtotal_getFgPo(program)
  const lvl_0_total_fgPo = await lvl_0_total_getFgPo(program)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(program)
  const lvl_2_subtotal_so = await lvl_2_subtotal_getSo(program)
  const lvl_3_subtotal_so = await lvl_3_subtotal_getSo(program)
  const lvl_0_total_so = await lvl_0_total_getSo(program)

  const lvl_1_subtotal_so_byWk = await lvl_1_subtotal_getSo_byWk(program)
  const lvl_2_subtotal_so_byWk = await lvl_2_subtotal_getSo_byWk(program)
  const lvl_3_subtotal_so_byWk = await lvl_3_subtotal_getSo_byWk(program)
  const lvl_0_total_so_byWk = await lvl_0_total_getSo_byWk(program)

  /* TAGGED SO */
  // const lvl_1_subtotal_soTagged = await lvl_1_subtotal_getSoTagged(program)
  // const lvl_2_subtotal_soTagged = await lvl_2_subtotal_getSoTagged(program)
  // const lvl_3_subtotal_soTagged = await lvl_3_subtotal_getSoTagged(program)
  // const lvl_0_total_soTagged = await lvl_0_total_getSoTagged(program)

  // const lvl_1_subtotal_soTagged_byWk = await lvl_1_subtotal_getSoTagged_byWk(program)
  // const lvl_2_subtotal_soTagged_byWk = await lvl_2_subtotal_getSoTagged_byWk(program)
  // const lvl_3_subtotal_soTagged_byWk = await lvl_3_subtotal_getSoTagged_byWk(program)
  // const lvl_0_total_soTagged_byWk = await lvl_0_total_getSoTagged_byWk(program)

  /* UNTAGGED SO */
  const lvl_1_subtotal_soUntagged = await lvl_1_subtotal_getSoUntagged(program)
  const lvl_2_subtotal_soUntagged = await lvl_2_subtotal_getSoUntagged(program)
  const lvl_3_subtotal_soUntagged = await lvl_3_subtotal_getSoUntagged(program)
  const lvl_0_total_soUntagged = await lvl_0_total_getSoUntagged(program)

  const lvl_1_subtotal_soUntagged_byWk = await lvl_1_subtotal_getSoUntagged_byWk(program)
  const lvl_2_subtotal_soUntagged_byWk = await lvl_2_subtotal_getSoUntagged_byWk(program)
  const lvl_3_subtotal_soUntagged_byWk = await lvl_3_subtotal_getSoUntagged_byWk(program)
  const lvl_0_total_soUntagged_byWk = await lvl_0_total_getSoUntagged_byWk(program)

  // ///////////////////////////////// SALES DATA
  const lvl_1_subtotal_salesByFy = await lvl_1_subtotal_getSalesByFy(start, end, program)
  const lvl_2_subtotal_salesByFy = await lvl_2_subtotal_getSalesByFy(start, end, program)
  const lvl_3_subtotal_salesByFy = await lvl_3_subtotal_getSalesByFy(start, end, program)
  const lvl_0_total_salesByFy = await lvl_0_total_getSalesByFy(start, end, program)

  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(start, end, program)
  const lvl_2_subtotal_salesByWk = await lvl_2_subtotal_getSalesByWk(start, end, program)
  const lvl_3_subtotal_salesByWk = await lvl_3_subtotal_getSalesByWk(start, end, program)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(start, end, program)
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(start, end, program)
  const lvl_2_subtotal_salesPeriodToDate = await lvl_2_subtotal_getSalesPeriodToDate(start, end, program)
  const lvl_3_subtotal_salesPeriodToDate = await lvl_3_subtotal_getSalesPeriodToDate(start, end, program)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(start, end, program)

  ///////////////////////////////// ROWS
  let rowsThirdLevelDetail
  let rowsSecondLevelDetail
  let rowsFirstLevelDetail

  if (showFyTrend) {
    // full fy trend requested. need rows for all data
    rowsThirdLevelDetail = await getRows_l3_showFyTrend(start, end, program)
    rowsSecondLevelDetail = await getRows_l2_showFyTrend(start, end, program)
    rowsFirstLevelDetail = await getRows_l1_showFyTrend(start, end, program)
  } else {
    // data request with start and end dates
    rowsThirdLevelDetail = await getRowsThirdLevelDetail(start, end, program)
    rowsSecondLevelDetail = await getRowsSecondLevelDetail(start, end, program)
    rowsFirstLevelDetail = await getRowsFirstLevelDetail(start, end, program)
  }
  const totalsRow = [{ totalRow: true, l1_label: 'FG SALES', l2_label: 'TOTAL', l3_label: 'TOTAL' }]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsThirdLevelDetail, ...rowsSecondLevelDetail, ...rowsFirstLevelDetail]
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_label.includes('TOTAL')) return 1
      if (b.l3_label.includes('TOTAL')) return -1

      if (a.l3_label < b.l3_label) return -1
      if (a.l3_label > b.l3_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label.includes('TOTAL')) return 1
      if (b.l2_label.includes('TOTAL')) return -1

      if (a.l2_label < b.l2_label) return -1
      if (a.l2_label > b.l2_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l1_label.includes('TOTAL')) return 1
      if (b.l1_label.includes('TOTAL')) return -1

      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
    2: 'l2_label',
    3: 'l3_label',
  })

  // switch to include fy trend data
  const showFyTrendSales = showFyTrend
    ? [...lvl_1_subtotal_salesByFy, ...lvl_2_subtotal_salesByFy, ...lvl_3_subtotal_salesByFy, ...lvl_0_total_salesByFy]
    : []

  const mappedSales = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesByWk,
      ...lvl_2_subtotal_salesByWk,
      ...lvl_3_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_2_subtotal_salesPeriodToDate,
      ...lvl_3_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_2_subtotal_so,
      ...lvl_3_subtotal_so,
      ...lvl_0_total_so,
      // ...lvl_1_subtotal_soTagged,
      // ...lvl_2_subtotal_soTagged,
      // ...lvl_3_subtotal_soTagged,
      // ...lvl_0_total_soTagged,
      ...lvl_1_subtotal_soUntagged,
      ...lvl_2_subtotal_soUntagged,
      ...lvl_3_subtotal_soUntagged,
      ...lvl_0_total_soUntagged,
      ...lvl_1_subtotal_so_byWk,
      ...lvl_2_subtotal_so_byWk,
      ...lvl_3_subtotal_so_byWk,
      ...lvl_0_total_so_byWk,
      // ...lvl_1_subtotal_soTagged_byWk,
      // ...lvl_2_subtotal_soTagged_byWk,
      // ...lvl_3_subtotal_soTagged_byWk,
      // ...lvl_0_total_soTagged_byWk,
      ...lvl_1_subtotal_soUntagged_byWk,
      ...lvl_2_subtotal_soUntagged_byWk,
      ...lvl_3_subtotal_soUntagged_byWk,
      ...lvl_0_total_soUntagged_byWk,
      ...showFyTrendSales,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_2_subtotal_fgInven,
      ...lvl_3_subtotal_fgInven,
      ...lvl_0_total_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_2_subtotal_fgInTransit,
      ...lvl_3_subtotal_fgInTransit,
      ...lvl_0_total_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_2_subtotal_fgAtLoc,
      ...lvl_3_subtotal_fgAtLoc,
      ...lvl_0_total_fgAtLoc,
      ...lvl_1_subtotal_fgAtLoc_untagged,
      ...lvl_2_subtotal_fgAtLoc_untagged,
      ...lvl_3_subtotal_fgAtLoc_untagged,
      ...lvl_0_total_fgAtLoc_untagged,
      // ...lvl_1_subtotal_fgAtLoc_tagged,
      // ...lvl_2_subtotal_fgAtLoc_tagged,
      // ...lvl_3_subtotal_fgAtLoc_tagged,
      // ...lvl_0_total_fgAtLoc_tagged,
      ...lvl_1_subtotal_fgPo,
      ...lvl_2_subtotal_fgPo,
      ...lvl_3_subtotal_fgPo,
      ...lvl_0_total_fgPo,
      // ...lvl_1_subtotal_rmPo,
      // ...lvl_2_subtotal_rmPo,
      // ...lvl_3_subtotal_rmPo,
      // ...lvl_0_total_rmPo,
      // ...lvl_1_subtotal_rmInven,
      // ...lvl_2_subtotal_rmInven,
      // ...lvl_3_subtotal_rmInven,
      // ...lvl_0_total_rmInven,
      // ...lvl_1_subtotal_rmInTransit,
      // ...lvl_2_subtotal_rmInTransit,
      // ...lvl_3_subtotal_rmInTransit,
      // ...lvl_0_total_rmInTransit,
      // ...lvl_1_subtotal_rmAtLoc,
      // ...lvl_2_subtotal_rmAtLoc,
      // ...lvl_3_subtotal_rmAtLoc,
      // ...lvl_0_total_rmAtLoc,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 3, then there is onlt the three labels and no other columns are populated
    if (Object.keys(mappedData[key]).length === 3) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  const finalData = cleanLabelsForDisplay(flattenedMappedData, program)
  const salesColsByWk = await getDateEndPerWeekByRange(start, end)
  // get data column names by fiscal year
  const salesColsByFy = await getFiscalYearCols()

  // get so by week cols
  const start_so = await getEarliestShipWk()
  const end_so = await getLatestShipWk()
  const soCols = await getDateEndPerWeekByRange_so(start_so, end_so)
  const soCols_tg = await getDateEndPerWeekByRange_so_tg(start_so, end_so)
  const soCols_untg = await getDateEndPerWeekByRange_so_untg(start_so, end_so)

  // return
  return { data: finalData, salesColsByWk: salesColsByWk, salesColsByFy: salesColsByFy, labelCols: labelCols, soCols, soCols_tg, soCols_untg }
}

module.exports = buildReport
