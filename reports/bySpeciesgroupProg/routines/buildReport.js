const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../shared/queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../shared/queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../../shared/queries/postgres/getSoDates')
const {
  lvl_1_subtotal_getSalesByWk,
  lvl_2_subtotal_getSalesByWk,
  lvl_0_total_getSalesByWk,
  lvl_1_subtotal_getSalesPeriodToDate,
  lvl_2_subtotal_getSalesPeriodToDate,
  lvl_0_total_getSalesPeriodToDate,
} = require('../../shared/queries/postgres/baseReport/getSalesTrend')
const {
  lvl_1_subtotal_getSalesByFyYtd,
  lvl_2_subtotal_getSalesByFyYtd,
  lvl_0_total_getSalesByFyYtd,
} = require('../../shared/queries/postgres/baseReport/getSalesTrendByFyYtd')
const {
  lvl_1_subtotal_getFgInven,
  lvl_2_subtotal_getFgInven,
  lvl_0_total_getFgInven,
  lvl_1_subtotal_getFgInTransit,
  lvl_2_subtotal_getFgInTransit,
  lvl_0_total_getFgInTransit,
  lvl_1_subtotal_getFgAtLoc,
  lvl_2_subtotal_getFgAtLoc,
  lvl_0_total_getFgAtLoc,
  lvl_1_subtotal_getFgAtLoc_tagged,
  lvl_2_subtotal_getFgAtLoc_tagged,
  lvl_0_total_getFgAtLoc_tagged,
  lvl_1_subtotal_getFgAtLoc_untagged,
  lvl_2_subtotal_getFgAtLoc_untagged,
  lvl_0_total_getFgAtLoc_untagged,
} = require('../../shared/queries/postgres/baseReport/getFgInven')
const { lvl_1_subtotal_getFgPo, lvl_2_subtotal_getFgPo, lvl_0_total_getFgPo } = require('../../shared/queries/postgres/baseReport/getFgOpenPo')
const {
  lvl_1_subtotal_getSo,
  lvl_2_subtotal_getSo,
  lvl_0_total_getSo,
  lvl_1_subtotal_getSoTagged,
  lvl_2_subtotal_getSoTagged,
  lvl_0_total_getSoTagged,
  lvl_1_subtotal_getSoUntagged,
  lvl_2_subtotal_getSoUntagged,
  lvl_0_total_getSoUntagged,
} = require('../../shared/queries/postgres/baseReport/getSo')
const {
  lvl_1_subtotal_getSo_byWk,
  lvl_2_subtotal_getSo_byWk,
  lvl_0_total_getSo_byWk,
  lvl_1_subtotal_getSoTagged_byWk,
  lvl_2_subtotal_getSoTagged_byWk,
  lvl_0_total_getSoTagged_byWk,
  lvl_1_subtotal_getSoUntagged_byWk,
  lvl_2_subtotal_getSoUntagged_byWk,
  lvl_0_total_getSoUntagged_byWk,
} = require('../../shared/queries/postgres/baseReport/getSoByWeek')

const { getRowsSecondLevelDetail, getRowsFirstLevelDetail } = require('../../shared/queries/postgres/baseReport/getRows')

const unflattenRowTemplate = require('../../shared/models/unflattenRowTemplate')
const mapSalesToRowTemplates = require('../../shared/models/mapSalesToRowTemplatesTwoLevel')
const mapInvenToRowTemplates = require('../../shared/models/mapInvenToRowTemplatesTwoLevel')
const combineMappedRows = require('../../shared/models/combineMappedRows')
const cleanLabelsForDisplay = require('../../shared/models/cleanLabelsForDisplay')
const calcPercentSalesCol = require('../../shared/models/calcPercentSalesCol')
const calcPercentKeyCol = require('../../shared/models/calcPercentKeyCol')
const calcAveWeeklySales = require('../../shared/models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../../shared/models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../shared/models/calcInventoryAvailable')

const labelCols = require('../queries/hardcode/cols')

const buildReport = async (start, end, showFyTrend, startWeek, endWeek) => {
  ///////////////////////////////// INVENTORY DATA

  const config = {
    l1_field: 'ms.species_group',
    l2_field: 'ms.program',
    program: null,
  }

  /* TOTAL FG */
  const lvl_1_subtotal_fgInven = await lvl_1_subtotal_getFgInven(config, config.program)
  const lvl_2_subtotal_fgInven = await lvl_2_subtotal_getFgInven(config, config.program)
  const lvl_0_total_fgInven = await lvl_0_total_getFgInven(config, config.program)
  /* FG IN TRANSIT*/
  const lvl_1_subtotal_fgInTransit = await lvl_1_subtotal_getFgInTransit(config, config.program)
  const lvl_2_subtotal_fgInTransit = await lvl_2_subtotal_getFgInTransit(config, config.program)
  const lvl_0_total_fgInTransit = await lvl_0_total_getFgInTransit(config, config.program)
  /* FG ON HAND (LESS IN TRANSIT) */
  const lvl_1_subtotal_fgAtLoc = await lvl_1_subtotal_getFgAtLoc(config, config.program)
  const lvl_2_subtotal_fgAtLoc = await lvl_2_subtotal_getFgAtLoc(config, config.program)
  const lvl_0_total_fgAtLocation = await lvl_0_total_getFgAtLoc(config, config.program)
  /* FG ON HAND TAGGED*/
  // const lvl_1_subtotal_fgAtLoc_tagged = await lvl_1_subtotal_getFgAtLoc_tagged(config, config.program)
  // const lvl_2_subtotal_fgAtLoc_tagged = await lvl_2_subtotal_getFgAtLoc_tagged(config, config.program)
  // const lvl_0_total_fgAtLoc_tagged = await lvl_0_total_getFgAtLoc_tagged(config, config.program)
  /* FG ON HAND UNTAGGED*/
  const lvl_1_subtotal_fgAtLoc_untagged = await lvl_1_subtotal_getFgAtLoc_untagged(config, config.program)
  const lvl_2_subtotal_fgAtLoc_untagged = await lvl_2_subtotal_getFgAtLoc_untagged(config, config.program)
  const lvl_0_total_fgAtLoc_untagged = await lvl_0_total_getFgAtLoc_untagged(config, config.program)

  /* FG ON ORDER */
  const lvl_1_subtotal_fgPo = await lvl_1_subtotal_getFgPo(config, config.program)
  const lvl_2_subtotal_fgPo = await lvl_2_subtotal_getFgPo(config, config.program)
  const lvl_0_total_fgPo = await lvl_0_total_getFgPo(config, config.program)

  ///////////////////////////////// SALES ORDERS
  /* TOTAL SO */
  const lvl_1_subtotal_so = await lvl_1_subtotal_getSo(config, config.program)
  const lvl_2_subtotal_so = await lvl_2_subtotal_getSo(config, config.program)
  const lvl_0_total_so = await lvl_0_total_getSo(config, config.program)
  const lvl_1_subtotal_so_byWk = await lvl_1_subtotal_getSo_byWk(config, config.program)
  const lvl_2_subtotal_so_byWk = await lvl_2_subtotal_getSo_byWk(config, config.program)
  const lvl_0_total_so_byWk = await lvl_0_total_getSo_byWk(config, config.program)

  /* SO TAGGED */
  // const lvl_1_subtotal_soTagged = await lvl_1_subtotal_getSoTagged(config, config.program)
  // const lvl_2_subtotal_soTagged = await lvl_2_subtotal_getSoTagged(config, config.program)
  // const lvl_0_total_soTagged = await lvl_0_total_getSoTagged(config, config.program)
  // const lvl_1_subtotal_soTagged_byWk = await lvl_1_subtotal_getSoTagged_byWk(config, config.program)
  // const lvl_2_subtotal_soTagged_byWk = await lvl_2_subtotal_getSoTagged_byWk(config, config.program)
  // const lvl_0_total_soTagged_byWk = await lvl_0_total_getSoTagged_byWk(config, config.program)

  /* SO UNTAGGED */
  const lvl_1_subtotal_soUntagged = await lvl_1_subtotal_getSoUntagged(config, config.program)
  const lvl_2_subtotal_soUntagged = await lvl_2_subtotal_getSoUntagged(config, config.program)
  const lvl_0_total_soUntagged = await lvl_0_total_getSoUntagged(config, config.program)
  const lvl_1_subtotal_soUntagged_byWk = await lvl_1_subtotal_getSoUntagged_byWk(config, config.program)
  const lvl_2_subtotal_soUntagged_byWk = await lvl_2_subtotal_getSoUntagged_byWk(config, config.program)
  const lvl_0_total_soUntagged_byWk = await lvl_0_total_getSoUntagged_byWk(config, config.program)

  ///////////////////////////////// SALES DATA
  /* EACH WEEK */
  const lvl_1_subtotal_salesByWk = await lvl_1_subtotal_getSalesByWk(config, start, end, config.program)
  const lvl_2_subtotal_salesByWk = await lvl_2_subtotal_getSalesByWk(config, start, end, config.program)
  const lvl_0_total_salesByWk = await lvl_0_total_getSalesByWk(config, start, end, config.program)
  /* TOTAL COL */
  const lvl_1_subtotal_salesPeriodToDate = await lvl_1_subtotal_getSalesPeriodToDate(config, start, end, config.program)
  const lvl_2_subtotal_salesPeriodToDate = await lvl_2_subtotal_getSalesPeriodToDate(config, start, end, config.program)
  const lvl_0_total_salesPeriodToDate = await lvl_0_total_getSalesPeriodToDate(config, start, end, config.program)
  /* EACH YEAR */
  const lvl_1_subtotal_salesByFy = await lvl_1_subtotal_getSalesByFyYtd(config, startWeek, endWeek, config.program, false)
  const lvl_2_subtotal_salesByFy = await lvl_2_subtotal_getSalesByFyYtd(config, startWeek, endWeek, config.program, false)
  const lvl_0_total_salesByFy = await lvl_0_total_getSalesByFyYtd(config, startWeek, endWeek, config.program, false)
  const lvl_1_subtotal_salesByFyYtd = await lvl_1_subtotal_getSalesByFyYtd(config, startWeek, endWeek, config.program, true)
  const lvl_2_subtotal_salesByFyYtd = await lvl_2_subtotal_getSalesByFyYtd(config, startWeek, endWeek, config.program, true)
  const lvl_0_total_salesByFyYtd = await lvl_0_total_getSalesByFyYtd(config, startWeek, endWeek, config.program, true)

  ///////////////////////////////// KPI DATA
  /* % COMPANY SALES */
  const lvl_1_percent_companySales = calcPercentSalesCol(
    lvl_0_total_salesPeriodToDate[0],
    lvl_1_subtotal_salesPeriodToDate,
    'percentCompanySales'
  )
  const lvl_2_percent_companySales = calcPercentSalesCol(
    lvl_0_total_salesPeriodToDate[0],
    lvl_2_subtotal_salesPeriodToDate,
    'percentCompanySales'
  )
  const lvl_0_percent_companySales = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_0_total_salesPeriodToDate, 'percentCompanySales')
  /* % SPECIES GROUP SALES */
  const lvl_1_percent_speciesGroupSales = calcPercentKeyCol(lvl_1_subtotal_salesPeriodToDate, 'l1_label', 'percentSpeciesGroupSales')
  const lvl_2_percent_speciesGroupSales = calcPercentKeyCol(lvl_2_subtotal_salesPeriodToDate, 'l1_label', 'percentSpeciesGroupSales')
  const lvl_0_percent_speciesGroupSales = calcPercentKeyCol(lvl_0_total_salesPeriodToDate, 'l1_label', 'percentSpeciesGroupSales')

  /* % REPORT TOTAL */
  const lvl_1_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_1_subtotal_salesPeriodToDate, 'percentReportTotal')
  const lvl_2_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_2_subtotal_salesPeriodToDate, 'percentReportTotal')
  const lvl_0_percent_reportTotal = calcPercentSalesCol(lvl_0_total_salesPeriodToDate[0], lvl_0_total_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const lvl_1_aveWeeklySales = calcAveWeeklySales(lvl_1_subtotal_salesPeriodToDate, 'aveWeeklySales', weeks)
  const lvl_2_aveWeeklySales = calcAveWeeklySales(lvl_2_subtotal_salesPeriodToDate, 'aveWeeklySales', weeks)
  const lvl_0_aveWeeklySales = calcAveWeeklySales(lvl_0_total_salesPeriodToDate, 'aveWeeklySales', weeks)

  /* WEEKS INV ON HAND */
  const lvl_1_weeksInvOnHand = calcWeeksInvOnHand(lvl_1_subtotal_fgInven, lvl_1_aveWeeklySales, 'weeksInvenOnHand')
  const lvl_2_weeksInvOnHand = calcWeeksInvOnHand(lvl_2_subtotal_fgInven, lvl_2_aveWeeklySales, 'weeksInvenOnHand')
  const lvl_0_weeksInvOnHand = calcWeeksInvOnHand(lvl_0_total_fgInven, lvl_0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const lvl_1_invAvailable = calcInventoryAvailable(lvl_1_subtotal_fgInven, lvl_1_subtotal_fgPo, lvl_1_subtotal_so, 'invenAvailable')
  const lvl_2_invAvailable = calcInventoryAvailable(lvl_2_subtotal_fgInven, lvl_2_subtotal_fgPo, lvl_2_subtotal_so, 'invenAvailable')
  const lvl_0_invAvailable = calcInventoryAvailable(lvl_0_total_fgInven, lvl_0_total_fgPo, lvl_0_total_so, 'invenAvailable')

  // /* WEEKS INV AVAILABLE */
  // THIS IS NOT A GOOD METRIC.
  // const lvl_1_weeksInvAvail = calcWeeksInvOnHand(lvl_1_invAvailable, lvl_1_aveWeeklySales, 'weeksInvenAvailable')
  // const lvl_2_weeksInvAvail = calcWeeksInvOnHand(lvl_2_invAvailable, lvl_2_aveWeeklySales, 'weeksInvenAvailable')
  // const lvl_0_weeksInvOAvail = calcWeeksInvOnHand(lvl_0_invAvailable, lvl_0_aveWeeklySales, 'weeksInvenAvailable')

  ///////////////////////////////// ROWS
  const levelTwoRows = await getRowsSecondLevelDetail(config, start, end, config.program, showFyTrend)
  const levelOneRows = await getRowsFirstLevelDetail(config, start, end, config.program, showFyTrend)

  const totalsRow = [{ totalRow: true, l1_label: 'FG SALES', l2_label: 'TOTAL' }]

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...levelTwoRows, ...levelOneRows]
    .sort((a, b) => {
      if (a.l2_label < b.l2_label) return -1
      if (a.l2_label > b.l2_label) return 1
      return 0
    })
    .sort((a, b) => {
      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })

  rowTemplate.push(...totalsRow)

  // map data into row template
  const rowTemplate_unflat = unflattenRowTemplate(rowTemplate)

  // switch to include fy trend data
  const fyTrendSales = showFyTrend
    ? [
        ...lvl_1_subtotal_salesByFy,
        ...lvl_2_subtotal_salesByFy,
        ...lvl_0_total_salesByFy,
        ...lvl_1_subtotal_salesByFyYtd,
        ...lvl_2_subtotal_salesByFyYtd,
        ...lvl_0_total_salesByFyYtd,
      ]
    : []

  const mappedSales = mapSalesToRowTemplates(
    [
      ...lvl_1_subtotal_salesPeriodToDate,
      ...lvl_2_subtotal_salesPeriodToDate,
      ...lvl_0_total_salesPeriodToDate,
      ...lvl_1_subtotal_so,
      ...lvl_2_subtotal_so,
      ...lvl_0_total_so,
      ...lvl_1_subtotal_salesByWk,
      ...lvl_2_subtotal_salesByWk,
      ...lvl_0_total_salesByWk,
      // ...lvl_1_subtotal_soTagged,
      // ...lvl_2_subtotal_soTagged,
      // ...lvl_0_total_soTagged,
      ...lvl_1_subtotal_soUntagged,
      ...lvl_2_subtotal_soUntagged,
      ...lvl_0_total_soUntagged,
      ...lvl_1_subtotal_so_byWk,
      ...lvl_2_subtotal_so_byWk,
      ...lvl_0_total_so_byWk,
      ...lvl_1_subtotal_soUntagged_byWk,
      ...lvl_2_subtotal_soUntagged_byWk,
      ...lvl_0_total_soUntagged_byWk,
      // ...lvl_1_subtotal_soTagged_byWk,
      // ...lvl_2_subtotal_soTagged_byWk,
      // ...lvl_0_total_soTagged_byWk,
      ...fyTrendSales,
      ...lvl_1_percent_companySales,
      ...lvl_2_percent_companySales,
      ...lvl_0_percent_companySales,
      ...lvl_1_percent_speciesGroupSales,
      ...lvl_2_percent_speciesGroupSales,
      ...lvl_0_percent_speciesGroupSales,
      ...lvl_1_percent_reportTotal,
      ...lvl_2_percent_reportTotal,
      ...lvl_0_percent_reportTotal,
      ...lvl_1_aveWeeklySales,
      ...lvl_2_aveWeeklySales,
      ...lvl_0_aveWeeklySales,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...lvl_1_subtotal_fgInven,
      ...lvl_2_subtotal_fgInven,
      ...lvl_0_total_fgInven,
      ...lvl_1_subtotal_fgInTransit,
      ...lvl_2_subtotal_fgInTransit,
      ...lvl_0_total_fgInTransit,
      ...lvl_1_subtotal_fgAtLoc,
      ...lvl_2_subtotal_fgAtLoc,
      ...lvl_0_total_fgAtLocation,
      ...lvl_1_subtotal_fgPo,
      ...lvl_2_subtotal_fgPo,
      ...lvl_0_total_fgPo,
      // ...lvl_1_subtotal_fgAtLoc_tagged,
      // ...lvl_2_subtotal_fgAtLoc_tagged,
      // ...lvl_0_total_fgAtLoc_tagged,
      ...lvl_1_subtotal_fgAtLoc_untagged,
      ...lvl_2_subtotal_fgAtLoc_untagged,
      ...lvl_0_total_fgAtLoc_untagged,
      ...lvl_1_weeksInvOnHand,
      ...lvl_2_weeksInvOnHand,
      ...lvl_0_weeksInvOnHand,
      ...lvl_1_invAvailable,
      ...lvl_2_invAvailable,
      ...lvl_0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = combineMappedRows(mappedSales, mappedInven)
  // clean out rows with zero sales
  Object.keys(mappedData).forEach(key => {
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })
  const flattenedMappedData = Object.values(mappedData)

  // remove row labels for l1_label except first row of each grouping // ALSO add filter datapoint with each l1_label, l2_label, l3_label
  const finalData = cleanLabelsForDisplay(flattenedMappedData)

  // get data column names
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

module.exports = buildReport
