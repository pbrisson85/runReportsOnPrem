const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../../queries/postgres/getSoDates')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getSalesTrend')
const { getCompanyTotalSales } = require('../../queries/postgres/getCompanyTotalSales')
const { lvl_0_total_getSalesPeriodToDate: lvl_0_program_getSalesPeriodToDate } = require('../../queries/postgres/baseReport/getSalesTrend')
const {
  lvl_1_subtotal_getSalesByFy,
  lvl_0_total_getSalesByFy,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getSalesTrendByFy')
const {
  lvl_1_subtotal_getSalesByFyYtd,
  lvl_0_total_getSalesByFyYtd,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getSalesTrendByFyYtd')
const {
  lvl_1_subtotal_getFgInven,
  lvl_0_total_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_0_total_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_0_total_getFgAtLoc,
  lvl_1_subtotal_getFgAtLoc_untagged,
  lvl_0_total_getFgAtLoc_untagged,
  lvl_1_subtotal_getFgAtLoc_tagged,
  lvl_0_total_getFgAtLoc_tagged,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getFgInven')
const { lvl_1_subtotal_getFgPo, lvl_0_total_getFgPo } = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getFgOpenPo')
const {
  lvl_1_subtotal_getSo,
  lvl_0_total_getSo,
  lvl_1_subtotal_getSoTagged,
  lvl_0_total_getSoTagged,
  lvl_1_subtotal_getSoUntagged,
  lvl_0_total_getSoUntagged,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getSo')
const {
  lvl_1_subtotal_getSo_byWk,
  lvl_0_total_getSo_byWk,
  lvl_1_subtotal_getSoTagged_byWk,
  lvl_0_total_getSoTagged_byWk,
  lvl_1_subtotal_getSoUntagged_byWk,
  lvl_0_total_getSoUntagged_byWk,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getSoByWeek')
const { getRowsFirstLevelDetail } = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getRows')
const {
  getRowsFirstLevelDetail: getRows_l1_showFyTrend,
} = require('../../queries/postgres/viewItemTrend_baseReport/byItem_level2/getRowsTrendByFy')
const mapSalesToRowTemplates = require('../../models/mapSalesToRowTemplatesOneLevel')
const mapInvenToRowTemplates = require('../../models/mapInvenToRowTemplatesOneLevel')
const combineMappedRows = require('../../models/combineMappedRows')
const cleanLabelsForDisplay = require('../../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../models/unflattenByCompositKey')
const calcPercentSalesCol = require('../../models/calcPercentSalesCol')
const calcAveWeeklySales = require('../../models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../models/calcInventoryAvailable')

const buildDrillDown = async (labelCols, config, program, start, end, filters, showFyTrend, startWeek, endWeek) => {
  console.log(program, '\n', start, '\n', end, '\n', filters)

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(config, program, filters)
  const lvl_0_total_fgInven = await lvl_0_total_getFgInven(config, program, filters)
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit(config, program, filters)
  const lvl_0_total_fgInTransit = await lvl_0_total_getFgInTransit(config, program, filters)
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc(config, program, filters)
  const lvl_0_total_fgAtLoc = await lvl_0_total_getFgAtLoc(config, program, filters)
  /* FG ON HAND UNTAGGED */
  const lvl_1_subtotal_fgAtLoc_untagged = await lvl_1_subtotal_getFgAtLoc_untagged(config, program, filters)
  const lvl_0_total_fgAtLoc_untagged = await lvl_0_total_getFgAtLoc_untagged(config, program, filters)
  /* FG ON HAND TAGGED */
  const lvl_1_subtotal_fgAtLoc_tagged = await lvl_1_subtotal_getFgAtLoc_tagged(config, program, filters)
  const lvl_0_total_fgAtLoc_tagged = await lvl_0_total_getFgAtLoc_tagged(config, program, filters)

  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo(config, program, filters)
  const lvl_0_total_fgPo = await lvl_0_total_getFgPo(config, program, filters)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(config, program, filters)
  const lvl_0_total_so = await lvl_0_total_getSo(config, program, filters)

  const lvl_1_subtotal_so_byWk = await lvl_1_subtotal_getSo_byWk(config, program, filters)
  const lvl_0_total_so_byWk = await lvl_0_total_getSo_byWk(config, program, filters)

  /* TAGGED SO */
  const lvl_1_subtotal_soTagged = await lvl_1_subtotal_getSoTagged(config, program, filters)
  const lvl_0_total_soTagged = await lvl_0_total_getSoTagged(config, program, filters)

  const lvl_1_subtotal_soTagged_byWk = await lvl_1_subtotal_getSoTagged_byWk(config, program, filters)
  const lvl_0_total_soTagged_byWk = await lvl_0_total_getSoTagged_byWk(config, program, filters)

  /* UNTAGGED SO */
  const lvl_1_subtotal_soUntagged = await lvl_1_subtotal_getSoUntagged(config, program, filters)
  const lvl_0_total_soUntagged = await lvl_0_total_getSoUntagged(config, program, filters)

  const lvl_1_subtotal_soUntagged_byWk = await lvl_1_subtotal_getSoUntagged_byWk(config, program, filters)
  const lvl_0_total_soUntagged_byWk = await lvl_0_total_getSoUntagged_byWk(config, program, filters)

  // ///////////////////////////////// SALES DATA
  const lvl_1_subtotal_salesByFy = await lvl_1_subtotal_getSalesByFy(config, start, end, program, filters)
  const lvl_0_total_salesByFy = await lvl_0_total_getSalesByFy(config, start, end, program, filters)
  const lvl_1_subtotal_salesByFyYtd = await lvl_1_subtotal_getSalesByFyYtd(config, startWeek, endWeek, program, filters)
  const lvl_0_total_salesByFyYtd = await lvl_0_total_getSalesByFyYtd(config, startWeek, endWeek, program, filters)
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(config, start, end, program, filters)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(config, start, end, program, filters)
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(config, start, end, program, filters)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(config, start, end, program, filters)
  const lvl_0_program_salesPeriodToDate = await lvl_0_program_getSalesPeriodToDate(config, start, end, program)

  const companyTotalSales = await getCompanyTotalSales(start, end)

  ///////////////////////////////// KPI DATA
  /* % COMPANY SALES */
  const lvl_1_percent_companySales = calcPercentSalesCol(companyTotalSales[0], lvl_1_subtotal_salesPeriodToDate, 'percentCompanySales')
  const lvl_0_percent_companySales = calcPercentSalesCol(companyTotalSales[0], lvl_0_total_salesPeriodToDate, 'percentCompanySales')

  /* % PROGRAM SALES */
  const lvl_1_percent_programSales = calcPercentSalesCol(
    lvl_0_program_salesPeriodToDate[0],
    lvl_1_subtotal_salesPeriodToDate,
    'percentProgramSales'
  )
  const lvl_0_percent_programSales = calcPercentSalesCol(
    lvl_0_program_salesPeriodToDate[0],
    lvl_0_total_salesPeriodToDate,
    'percentProgramSales'
  )
  /* % REPORT TOTAL */
  const lvl_1_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_1_subtotal_salesPeriodToDate, 'percentReportTotal')
  const lvl_0_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_0_total_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const lvl_1_aveWeeklySales = calcAveWeeklySales(lvl_1_subtotal_salesPeriodToDate, 'aveWeeklySales', weeks)
  const lvl_0_aveWeeklySales = calcAveWeeklySales(lvl_0_total_salesPeriodToDate, 'aveWeeklySales', weeks)

  /* WEEKS INV ON HAND */
  const lvl_1_weeksInvOnHand = calcWeeksInvOnHand(lvl_1_subtotal_fgInven, lvl_1_aveWeeklySales, 'weeksInvenOnHand')
  const lvl_0_weeksInvOnHand = calcWeeksInvOnHand(lvl_0_total_fgInven, lvl_0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const lvl_1_invAvailable = calcInventoryAvailable(lvl_1_subtotal_fgInven, lvl_1_subtotal_fgPo, lvl_1_subtotal_so, 'invenAvailable')
  const lvl_0_invAvailable = calcInventoryAvailable(lvl_0_total_fgInven, lvl_0_total_fgPo, lvl_0_total_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  let rowsFirstLevelDetail
  if (showFyTrend) {
    // full fy trend requested. need rows for all data
    rowsFirstLevelDetail = await getRows_l1_showFyTrend(config, start, end, program, filters)
  } else {
    // data request with start and end dates
    rowsFirstLevelDetail = await getRowsFirstLevelDetail(config, start, end, program, filters)
  }
  const totalsRow = [{ totalRow: true, l1_label: `FG SALES`, l2_label: `TOTAL` }] // Need an l2_label of TOTAL for front end styling
  const filterRow = [{ filterRow: true, l1_label: `PROGRAM: ${program}, FILTERS: ${filters[0]}, ${filters[1]}` }] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  // switch to include fy trend data
  const fyTrendSales = showFyTrend
    ? [...lvl_1_subtotal_salesByFy, ...lvl_0_total_salesByFy, ...lvl_1_subtotal_salesByFyYtd, ...lvl_0_total_salesByFyYtd]
    : []

  const mappedSales = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_0_total_so,
      ...lvl_1_subtotal_soTagged,
      ...lvl_0_total_soTagged,
      ...lvl_1_subtotal_soUntagged,
      ...lvl_0_total_soUntagged,
      ...lvl_1_subtotal_so_byWk,
      ...lvl_0_total_so_byWk,
      ...lvl_1_subtotal_soTagged_byWk,
      ...lvl_0_total_soTagged_byWk,
      ...lvl_1_subtotal_soUntagged_byWk,
      ...lvl_0_total_soUntagged_byWk,
      ...fyTrendSales,
      ...lvl_1_percent_companySales,
      ...lvl_0_percent_companySales,
      ...lvl_1_percent_programSales,
      ...lvl_0_percent_programSales,
      ...lvl_1_percent_reportTotal,
      ...lvl_0_percent_reportTotal,
      ...lvl_1_aveWeeklySales,
      ...lvl_0_aveWeeklySales,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_0_total_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_0_total_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_0_total_fgAtLoc,
      ...lvl_1_subtotal_fgAtLoc_untagged,
      ...lvl_0_total_fgAtLoc_untagged,
      ...lvl_1_subtotal_fgAtLoc_tagged,
      ...lvl_0_total_fgAtLoc_tagged,
      ...lvl_1_subtotal_fgPo,
      ...lvl_0_total_fgPo,
      ...lvl_1_weeksInvOnHand,
      ...lvl_0_weeksInvOnHand,
      ...lvl_1_invAvailable,
      ...lvl_0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 1, then there is only the one label and no other columns are populated
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  let finalData = cleanLabelsForDisplay(flattenedMappedData, '')
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l3_label < b.l3_label) return -1
      if (a.l3_label > b.l3_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_label.includes('TOTAL')) return 1
      if (b.l2_label.includes('TOTAL')) return -1
      return 0
    }) // no label in total row, first col
  finalData = [...filterRow, ...finalData]

  console.log(rowTemplate)

  const salesColsByWk = await getDateEndPerWeekByRange(start, end)

  // get data column names by fiscal year
  let salesColsByFy = null
  let salesColsByFyYtd = null
  if (showFyTrend) salesColsByFy = await getFiscalYearCols()
  if (showFyTrend) salesColsByFyYtd = await getFiscalYearYtdCols()

  // get so by week cols
  const start_so = await getEarliestShipWk()
  const end_so = await getLatestShipWk()
  const soCols = await getDateEndPerWeekByRange_so(start_so, end_so)
  const soCols_tg = await getDateEndPerWeekByRange_so_tg(start_so, end_so)
  const soCols_untg = await getDateEndPerWeekByRange_so_untg(start_so, end_so)

  // return
  return {
    data: finalData,
    salesColsByWk: salesColsByWk,
    salesColsByFy: salesColsByFy,
    salesColsByFyYtd: salesColsByFyYtd,
    labelCols: labelCols,
    soCols,
    soCols_tg,
    soCols_untg,
  }
}

module.exports = buildDrillDown
