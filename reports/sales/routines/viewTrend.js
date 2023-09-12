const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../queries/postgres/getFiscalYearCols')
const { getLatestShipWk, getEarliestShipWk } = require('../queries/postgres/getSoDates')
const {
  l1_getSalesByWk,
  l0_getSalesByWk,
  l1_getSalesPeriodToDate,
  l0_getSalesPeriodToDate,
} = require('../queries/postgres/viewTrend/getSalesTrendDateDriven')
const { l1_getSalesWkDriven, l0_getSalesWkDriven } = require('../queries/postgres/viewTrend/getSalesTrendWkDriven')
const { getCompanyTotalSales } = require('../queries/postgres/kpi/getCompanyTotalSales')
const { l0_getSalesPeriodToDate: l0_program_getSalesPeriodToDate } = require('../queries/postgres/baseReport/getSalesTrendDateDriven')
const { l1_getSalesByFyYtd, l0_getSalesByFyYtd } = require('../queries/postgres/viewTrend/getSalesTrendByFyYtd')
const {
  l1_getFgInven,
  l0_getFgInven,
  l1_getFgInTransit,
  l0_getFgInTransit,
  l1_getFgAtLoc,
  l0_getFgAtLoc,
  l1_getFgAtLoc_untagged,
  l0_getFgAtLoc_untagged,
  l1_getFgAtLoc_tagged,
  l0_getFgAtLoc_tagged,
} = require('../queries/postgres/viewTrend/getFgInven')
const { l1_getFgPo, l0_getFgPo } = require('../queries/postgres/viewTrend/getFgOpenPo')
const { l1_getSo, l0_getSo, l1_getSoTagged, l0_getSoTagged, l1_getSoUntagged, l0_getSoUntagged } = require('../queries/postgres/viewTrend/getSo')
const {
  l1_getSo_byWk,
  l0_getSo_byWk,
  l1_getSoTagged_byWk,
  l0_getSoTagged_byWk,
  l1_getSoUntagged_byWk,
  l0_getSoUntagged_byWk,
} = require('../queries/postgres/viewTrend/getSoByWeek')
const { getRowsFirstLevelDetail } = require('../queries/postgres/viewTrend/getRows')
const mapSalesToRowTemplates = require('../models/mapSalesToRowTemplatesOneLevel')
const mapInvenToRowTemplates = require('../models/mapInvenToRowTemplatesOneLevel')
const combineMappedRows = require('../models/combineMappedRows')
const cleanLabelsForDisplay = require('../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../models/unflattenByCompositKey')
const calcPercentSalesCol = require('../models/calcPercentSalesCol')
const calcAveWeeklySales = require('../models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../models/calcInventoryAvailable')

const buildDrillDown = async (labelCols, config, start, end, showFyTrend, startWeek, endWeek, trendQuery, year) => {
  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const l1_fgInven = await l1_getFgInven(config, trendQuery)
  const l0_fgInven = await l0_getFgInven(config, trendQuery)
  /* FG IN TRANSIT*/
  const l1_fgInTransit = await l1_getFgInTransit(config, trendQuery)
  const l0_fgInTransit = await l0_getFgInTransit(config, trendQuery)
  /* FG ON HAND (LESS IN TRANSIT) */
  const l1_fgAtLoc = await l1_getFgAtLoc(config, trendQuery)
  const l0_fgAtLoc = await l0_getFgAtLoc(config, trendQuery)
  /* FG ON HAND UNTAGGED */
  const l1_fgAtLoc_untagged = await l1_getFgAtLoc_untagged(config, trendQuery)
  const l0_fgAtLoc_untagged = await l0_getFgAtLoc_untagged(config, trendQuery)
  /* FG ON HAND TAGGED */
  const l1_fgAtLoc_tagged = await l1_getFgAtLoc_tagged(config, trendQuery)
  const l0_fgAtLoc_tagged = await l0_getFgAtLoc_tagged(config, trendQuery)

  /* FG ON ORDER */
  const l1_fgPo = await l1_getFgPo(config, trendQuery)
  const l0_fgPo = await l0_getFgPo(config, trendQuery)

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l1_so = await l1_getSo(config, trendQuery)
  const l0_so = await l0_getSo(config)

  const l1_so_byWk = await l1_getSo_byWk(config, trendQuery)
  const l0_so_byWk = await l0_getSo_byWk(config)

  /* TAGGED SO */
  const l1_soTagged = await l1_getSoTagged(config, trendQuery)
  const l0_soTagged = await l0_getSoTagged(config)

  const l1_soTagged_byWk = await l1_getSoTagged_byWk(config, trendQuery)
  const l0_soTagged_byWk = await l0_getSoTagged_byWk(config)

  /* UNTAGGED SO */
  const l1_soUntagged = await l1_getSoUntagged(config, trendQuery)
  const l0_soUntagged = await l0_getSoUntagged(config)

  const l1_soUntagged_byWk = await l1_getSoUntagged_byWk(config, trendQuery)
  const l0_soUntagged_byWk = await l0_getSoUntagged_byWk(config)

  // ///////////////////////////////// SALES DATA
  const l1_salesByFy = await l1_getSalesByFyYtd(config, start, end, false, trendQuery)
  const l0_salesByFy = await l0_getSalesByFyYtd(config, start, end, false)

  const l1_salesByFyYtd = await l1_getSalesByFyYtd(config, startWeek, endWeek, true, trendQuery)
  const l0_salesByFyYtd = await l0_getSalesByFyYtd(config, startWeek, endWeek, true)

  const l1_salesByWk = await l1_getSalesByWk(config, start, end, trendQuery)
  const l0_salesByWk = await l0_getSalesByWk(config, start, end)

  const l1_salesPeriodToDate = await l1_getSalesPeriodToDate(config, start, end, trendQuery)
  const l0_salesPeriodToDate = await l0_getSalesPeriodToDate(config, start, end)

  const l1_trailingTwoWeek = endWeek < 2 ? [] : await l1_getSalesWkDriven(config, endWeek - 1, endWeek, trendQuery, year)
  const l0_trailingTwoWeek = endWeek < 2 ? [] : await l0_getSalesWkDriven(config, endWeek - 1, endWeek, year)

  const l1_trailingFourWeek = endWeek < 4 ? [] : await l1_getSalesWkDriven(config, endWeek - 3, endWeek, trendQuery, year)
  const l0_trailingFourWeek = endWeek < 4 ? [] : await l0_getSalesWkDriven(config, endWeek - 3, endWeek, year)

  const l1_trailingEightWeek = endWeek < 8 ? [] : await l1_getSalesWkDriven(config, endWeek - 7, endWeek, trendQuery, year)
  const l0_trailingEightWeek = endWeek < 8 ? [] : await l0_getSalesWkDriven(config, endWeek - 7, endWeek, year)

  const l1_trailingTwelveWeek = endWeek < 12 ? [] : await l1_getSalesWkDriven(config, endWeek - 11, endWeek, trendQuery, year)
  const l0_trailingTwelveWeek = endWeek < 12 ? [] : await l0_getSalesWkDriven(config, endWeek - 11, endWeek, year)

  const companyTotalSales = await getCompanyTotalSales(start, end, config)

  ///////////////////////////////// KPI DATA
  /* % COMPANY SALES */
  const l1_percent_companySales = calcPercentSalesCol(companyTotalSales[0], l1_salesPeriodToDate, 'percentCompanySales')
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSales[0], l0_salesPeriodToDate, 'percentCompanySales')

  /* % PROGRAM SALES */
  let l1_percent_programSales = []
  let l0_percent_programSales = []
  if (config.program !== null) {
    const l0_program_salesPeriodToDate = await l0_program_getSalesPeriodToDate(config, start, end, config.program)
    l1_percent_programSales = calcPercentSalesCol(l0_program_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentProgramSales')
    l0_percent_programSales = calcPercentSalesCol(l0_program_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentProgramSales')
  }

  /* % REPORT TOTAL */
  const l1_percent_reportTotal = calcPercentSalesCol(l0_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentReportTotal')
  const l0_percent_reportTotal = calcPercentSalesCol(l0_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = endWeek - startWeek + 1
  const l1_aveWeeklySales = calcAveWeeklySales(l1_salesPeriodToDate, 'aveWeeklySales', weeks)
  const l0_aveWeeklySales = calcAveWeeklySales(l0_salesPeriodToDate, 'aveWeeklySales', weeks)

  const l1_twoWkAveSales = calcAveWeeklySales(l1_trailingTwoWeek, 'twoWkAveSales', 2)
  const l0_twoWkAveSales = calcAveWeeklySales(l0_trailingTwoWeek, 'twoWkAveSales', 2)

  const l1_fourWkAveSales = calcAveWeeklySales(l1_trailingFourWeek, 'fourWkAveSales', 4)
  const l0_fourWkAveSales = calcAveWeeklySales(l0_trailingFourWeek, 'fourWkAveSales', 4)

  const l1_eightWkAveSales = calcAveWeeklySales(l1_trailingEightWeek, 'eightWkAveSales', 8)
  const l0_eightWkAveSales = calcAveWeeklySales(l0_trailingEightWeek, 'eightWkAveSales', 8)

  const l1_twelveWkAveSales = calcAveWeeklySales(l1_trailingTwelveWeek, 'twelveWkAveSales', 12)
  const l0_twelveWkAveSales = calcAveWeeklySales(l0_trailingTwelveWeek, 'twelveWkAveSales', 12)

  /* WEEKS INV ON HAND */
  const l1_weeksInvOnHand = !l1_fgInven.length ? [] : calcWeeksInvOnHand(l1_fgInven, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l0_weeksInvOnHand = !l0_fgInven.length ? [] : calcWeeksInvOnHand(l0_fgInven, l0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const l1_invAvailable = !l1_fgInven.length ? [] : calcInventoryAvailable(l1_fgInven, l1_fgPo, l1_so, 'invenAvailable')
  const l0_invAvailable = !l0_fgInven.length ? [] : calcInventoryAvailable(l0_fgInven, l0_fgPo, l0_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  const rowsFirstLevelDetail = await getRowsFirstLevelDetail(config, start, end, showFyTrend, trendQuery)

  const totalsRow = [{ totalRow: true, l1_label: `FG SALES`, l2_label: `TOTAL`, datalevel: config.queryLevel }] // Need an l2_label of TOTAL for front end styling
  const filterRow = [
    {
      filterRow: true,
      l1_label: `${`
                  ${config.program && `prog: ${config.program}, `}
                  ${config.l1_filter && `${config.l1_field}: ${config.l1_filter}, `}
                  ${config.l2_filter && `${config.l2_field}: ${config.l2_filter}, `}
                  ${config.l3_filter && `${config.l3_field}: ${config.l3_filter}, `}
                  ${config.l4_filter && `${config.l4_field}: ${config.l4_filter}, `}
                  ${config.customer && `cust: ${config.customer}, `}
                  ${config.item && `item: ${config.item}, `}
                  ${config.salesPerson && `salesperson: ${config.salesPerson}, `}
                  ${config.country && `country: ${config.country}, `}
                  ${config.state && `state: ${config.state}, `}
                  ${config.export && `usa vs export: ${config.export}, `}
                  ${config.northAmerica && `north america vs foreign: ${config.northAmerica}, `}
                 `}`,
    },
  ] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  // switch to include fy trend data
  const fyTrendSales = showFyTrend ? [...l1_salesByFy, ...l0_salesByFy, ...l1_salesByFyYtd, ...l0_salesByFyYtd] : []

  const mappedSales = mapSalesToRowTemplates(
    [
      ...l1_salesByWk,
      ...l0_salesByWk,
      ...l1_salesPeriodToDate,
      ...l0_salesPeriodToDate,
      ...l1_so,
      ...l0_so,
      ...l1_soTagged,
      ...l0_soTagged,
      ...l1_soUntagged,
      ...l0_soUntagged,
      ...l1_so_byWk,
      ...l0_so_byWk,
      ...l1_soTagged_byWk,
      ...l0_soTagged_byWk,
      ...l1_soUntagged_byWk,
      ...l0_soUntagged_byWk,
      ...fyTrendSales,
      ...l1_percent_companySales,
      ...l0_percent_companySales,
      ...l1_percent_programSales,
      ...l0_percent_programSales,
      ...l1_percent_reportTotal,
      ...l0_percent_reportTotal,
      ...l1_aveWeeklySales,
      ...l0_aveWeeklySales,
      ...l1_twoWkAveSales,
      ...l0_twoWkAveSales,
      ...l1_fourWkAveSales,
      ...l0_fourWkAveSales,
      ...l1_eightWkAveSales,
      ...l0_eightWkAveSales,
      ...l1_twelveWkAveSales,
      ...l0_twelveWkAveSales,
    ],
    rowTemplate_unflat
  )

  const mappedInven = mapInvenToRowTemplates(
    [
      ...l1_fgInven,
      ...l0_fgInven,
      ...l1_fgInTransit,
      ...l0_fgInTransit,
      ...l1_fgAtLoc,
      ...l0_fgAtLoc,
      ...l1_fgAtLoc_untagged,
      ...l0_fgAtLoc_untagged,
      ...l1_fgAtLoc_tagged,
      ...l0_fgAtLoc_tagged,
      ...l1_fgPo,
      ...l0_fgPo,
      ...l1_weeksInvOnHand,
      ...l0_weeksInvOnHand,
      ...l1_invAvailable,
      ...l0_invAvailable,
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
      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at end
      if (a.l2_filter?.includes('TOTAL')) return 1
      if (b.l2_filter?.includes('TOTAL')) return -1
      return 0
    }) // no label in total row, first col
  finalData = [...filterRow, ...finalData]

  const salesColsByWk = await getDateEndPerWeekByRange(start, end, config)

  // get data column names by fiscal year
  let salesColsByFy = null
  let salesColsByFyYtd = null
  if (showFyTrend) salesColsByFy = await getFiscalYearCols()
  if (showFyTrend) salesColsByFyYtd = await getFiscalYearYtdCols()

  // get so by week cols
  const start_so = await getEarliestShipWk(config)
  const end_so = await getLatestShipWk(config)
  const soCols = await getDateEndPerWeekByRange_so(start_so, end_so, config)
  const soCols_tg = await getDateEndPerWeekByRange_so_tg(start_so, end_so, config)
  const soCols_untg = await getDateEndPerWeekByRange_so_untg(start_so, end_so, config)

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
