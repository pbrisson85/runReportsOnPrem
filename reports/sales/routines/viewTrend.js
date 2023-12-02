const {
  getDateEndPerWeekByRange_pj,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../../database/queries/postgres/getDateEndPerWeek')
const { getTrendColsCalMonths } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsCalMonths')
const { getTrendColsWeeks } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsWeeks')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../../database/queries/postgres/trendColHeadings/getTrendColsFiscalYear')
const { getLatestShipWk, getEarliestShipWk } = require('../../../database/queries/postgres/getSoDates')
const {
  l1_getSalesByWk,
  l0_getSalesByWk,
  l1_getSalesPeriodToDate,
  l0_getSalesPeriodToDate,
} = require('../../../database/queries/postgres/viewTrend/getSalesTrendDateDriven')
const {
  l1_getSalesProjByWk,
  l0_getSalesProjByWk,
  l1_getSalesProjPeriodToDate,
  l0_getSalesProjPeriodToDate,
} = require('../../../database/queries/postgres/viewTrend/getSalesProjection')
const { l1_getSalesWkDriven, l0_getSalesWkDriven } = require('../../../database/queries/postgres/viewTrend/getSalesTrendWkDriven')
const { getCompanyTotalSales } = require('../../../database/queries/postgres/kpi/getCompanyTotalSales_OLD')
const { l0_getSalesPeriodToDate: l0_program_getSalesPeriodToDate } = require('../../../database/queries/postgres/baseReport/getSalesTrendDateDriven')
const { l1_getSalesByFyYtd, l0_getSalesByFyYtd } = require('../../../database/queries/postgres/viewTrend/getSalesTrendByFyYtd')
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
} = require('../../../database/queries/postgres/viewTrend/getFgInven')
const { l1_getFgPo, l0_getFgPo } = require('../../../database/queries/postgres/viewTrend/getFgOpenPo')
const { l1_getSo, l0_getSo, l1_getSoTagged, l0_getSoTagged, l1_getSoUntagged, l0_getSoUntagged } = require('../../../database/queries/postgres/viewTrend/getSo')
const {
  l1_getSo_byWk,
  l0_getSo_byWk,
  l1_getSoTagged_byWk,
  l0_getSoTagged_byWk,
  l1_getSoUntagged_byWk,
  l0_getSoUntagged_byWk,
} = require('../../../database/queries/postgres/viewTrend/getSoByWeek')
const { getRowsFirstLevelDetail } = require('../../../database/queries/postgres/viewTrend/getRows')
const mapSalesToRowTemplates = require('../../../models/mapSalesToRowTemplatesOneLevel')
const mapInvenToRowTemplates = require('../../../models/mapInvenToRowTemplatesOneLevel')
const combineMappedRows = require('../../../models/combineMappedRows')
const cleanLabelsForDisplay = require('../../../models/cleanLabelsForDisplay')
const unflattenByCompositKey = require('../../../models/unflattenByCompositKey')
const calcPercentSalesCol = require('../../../models/calcPercentSalesCol')
const calcYoyYtdSalesCol = require('../../../models/calcYoyYtdSalesCol')
const calcMomentum = require('../../../models/calcMomentumSalesCol')
const calcAveWeeklySales = require('../../../models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../../../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../../models/calcInventoryAvailable')
const columnConfigs = require('../data/baseCols/columns')


// Note that KPI data does not have the logic cleaned up to handle useSalesProjection like the base report does at this time.

const buildDrillDown = async (labelCols, config, trendQuery) => {
  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const l1_fgInvenF = () => { return l1_getFgInven(config, trendQuery)}
  const l0_fgInvenF = () => { return l0_getFgInven(config, trendQuery)}
  /* FG IN TRANSIT*/
  const l1_fgInTransitF = () => { return l1_getFgInTransit(config, trendQuery)}
  const l0_fgInTransitF = () => { return l0_getFgInTransit(config, trendQuery)}
  /* FG ON HAND (LESS IN TRANSIT) */
  const l1_fgAtLocF = () => { return l1_getFgAtLoc(config, trendQuery)}
  const l0_fgAtLocF = () => { return l0_getFgAtLoc(config, trendQuery)}
  /* FG ON HAND UNTAGGED */
  const l1_fgAtLoc_untaggedF = () => { return l1_getFgAtLoc_untagged(config, trendQuery)}
  const l0_fgAtLoc_untaggedF = () => { return l0_getFgAtLoc_untagged(config, trendQuery)}
  /* FG ON HAND TAGGED */
  const l1_fgAtLoc_taggedF = () => { return l1_getFgAtLoc_tagged(config, trendQuery)}
  const l0_fgAtLoc_taggedF = () => { return l0_getFgAtLoc_tagged(config, trendQuery)}

  /* FG ON ORDER */
  const l1_fgPoF = () => { return l1_getFgPo(config, trendQuery)}
  const l0_fgPoF = () => { return l0_getFgPo(config, trendQuery)}

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l1_soF = () => { return l1_getSo(config, trendQuery)}
  const l0_soF = () => { return l0_getSo(config)}

  const l1_so_byWkF = () => { return l1_getSo_byWk(config, trendQuery)}
  const l0_so_byWkF = () => { return l0_getSo_byWk(config)}

  /* TAGGED SO */
  const l1_soTaggedF = () => { return l1_getSoTagged(config, trendQuery)}
  const l0_soTaggedF = () => { return l0_getSoTagged(config)}

  const l1_soTagged_byWkF = () => { return l1_getSoTagged_byWk(config, trendQuery)}
  const l0_soTagged_byWkF = () => { return l0_getSoTagged_byWk(config)}

  /* UNTAGGED SO */
  const l1_soUntaggedF = () => { return l1_getSoUntagged(config, trendQuery)}
  const l0_soUntaggedF = () => { return l0_getSoUntagged(config)}

  const l1_soUntagged_byWkF = () => { return l1_getSoUntagged_byWk(config, trendQuery)}
  const l0_soUntagged_byWkF = () => { return l0_getSoUntagged_byWk(config)}

  // ///////////////////////////////// SALES DATA

  /* SALES PROJECTIONS */
  const l1_salesProjByWkF = !config.trends.useProjection ? skip() : () => {return l1_getSalesProjByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)}
  const l0_salesProjByWkF = !config.trends.useProjection ? skip() : () => {return l0_getSalesProjByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}

  const l1_salesProjPeriodToDateF = !config.totals.useProjection ? skip() : () => {return l1_getSalesProjPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)}
  const l0_salesProjPeriodToDateF = !config.totals.useProjection ? skip() : () => {return l0_getSalesProjPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}

  /* SALES */
  const l1_salesByFyF = !config.trends.fyFullYear ? skip() : () => { return l1_getSalesByFyYtd(config, config.totals.startDatePrimary, config.totals.endDatePrimary, false, trendQuery)}
  const l0_salesByFyF = !config.trends.fyFullYear ? skip() : () => { return l0_getSalesByFyYtd(config, config.totals.startDatePrimary, config.totals.endDatePrimary, false)}

  const l1_salesByFyYtdF = !config.trends.fyYtd ? skip() : () => { return l1_getSalesByFyYtd(config, config.totals.startWeekPrimary, config.totals.endWeekPrimary, true, trendQuery)}
  const l0_salesByFyYtdF = !config.trends.fyYtd ? skip() : () => { return l0_getSalesByFyYtd(config, config.totals.startWeekPrimary, config.totals.endWeekPrimary, true)}

  const l1_salesByWkF = !config.trends.fiscalWeeks ? skip() : () => { return l1_getSalesByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)}
  const l0_salesByWkF = !config.trends.fiscalWeeks ? skip() : () => { return l0_getSalesByWk(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}

  const l1_salesPeriodToDateF = () => { return l1_getSalesPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)}
  const l0_salesPeriodToDateF = () => { return l0_getSalesPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary)}

  /* KPI Data */
  
  const l1_trailingTwoWeekF = config.totals.endWeekPrimary < 2 ? skip() : () => { return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '2wk Rolling')}
  const l0_trailingTwoWeekF = config.totals.endWeekPrimary < 2 ? skip() : () => { return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}

  const l1_trailingFourWeekF = config.totals.endWeekPrimary < 4 ? skip() : () => { return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '4wk Rolling')}
  const l0_trailingFourWeekF = config.totals.endWeekPrimary < 4 ? skip() : () => { return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}

  const l1_trailingEightWeekF = config.totals.endWeekPrimary < 8 ? skip() : () => { return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '8wk Rolling')}
  const l0_trailingEightWeekF = config.totals.endWeekPrimary < 8 ? skip() : () => { return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}

  const l1_trailingTwelveWeekF = config.totals.endWeekPrimary < 12 ? skip() : () => { return l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '12wk Rolling')}
  const l0_trailingTwelveWeekF = config.totals.endWeekPrimary < 12 ? skip() : () => { return l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}

  const companyTotalSalesF = () => { return getCompanyTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}

  const [
    l1_salesProjByWk,
    l0_salesProjByWk,
    l1_salesProjPeriodToDate,
    l0_salesProjPeriodToDate,
    l1_fgInven, l0_fgInven, 
    l1_fgInTransit, 
    l0_fgInTransit, 
    l1_fgAtLoc, 
    l0_fgAtLoc, 
    l1_fgAtLoc_untagged, 
    l0_fgAtLoc_untagged, 
    l1_fgAtLoc_tagged, 
    l0_fgAtLoc_tagged, 
    l1_fgPo, l0_fgPo, 
    l1_so, l0_so, 
    l1_soTagged, 
    l0_soTagged, 
    l1_soUntagged, 
    l0_soUntagged, 
    l1_so_byWk, 
    l0_so_byWk, 
    l1_soTagged_byWk, 
    l0_soTagged_byWk, 
    l1_soUntagged_byWk, 
    l0_soUntagged_byWk, 
    l1_salesByFy, 
    l0_salesByFy, 
    l1_salesByFyYtd, 
    l0_salesByFyYtd, 
    l1_salesByWk, 
    l0_salesByWk, 
    l1_salesPeriodToDate, 
    l0_salesPeriodToDate, 
    l1_trailingTwoWeek, 
    l0_trailingTwoWeek, 
    l1_trailingFourWeek, 
    l0_trailingFourWeek, 
    l1_trailingEightWeek, 
    l0_trailingEightWeek, 
    l1_trailingTwelveWeek, 
    l0_trailingTwelveWeek, 
    companyTotalSales 
  ] = await Promise.all([
    l1_salesProjByWkF(),
    l0_salesProjByWkF(),
    l1_salesProjPeriodToDateF(),
    l0_salesProjPeriodToDateF(),
    l1_fgInvenF(), 
    l0_fgInvenF(), 
    l1_fgInTransitF(), 
    l0_fgInTransitF(), 
    l1_fgAtLocF(), 
    l0_fgAtLocF(), 
    l1_fgAtLoc_untaggedF(), 
    l0_fgAtLoc_untaggedF(), 
    l1_fgAtLoc_taggedF(), 
    l0_fgAtLoc_taggedF(), 
    l1_fgPoF(), 
    l0_fgPoF(), 
    l1_soF(), 
    l0_soF(), 
    l1_soTaggedF(), 
    l0_soTaggedF(), 
    l1_soUntaggedF(), 
    l0_soUntaggedF(), 
    l1_so_byWkF(), 
    l0_so_byWkF(), 
    l1_soTagged_byWkF(), 
    l0_soTagged_byWkF(), 
    l1_soUntagged_byWkF(), 
    l0_soUntagged_byWkF(), 
    l1_salesByFyF(), 
    l0_salesByFyF(), 
    l1_salesByFyYtdF(), 
    l0_salesByFyYtdF(), 
    l1_salesByWkF(), 
    l0_salesByWkF(), 
    l1_salesPeriodToDateF(), 
    l0_salesPeriodToDateF(), 
    l1_trailingTwoWeekF(), 
    l0_trailingTwoWeekF(), 
    l1_trailingFourWeekF(), 
    l0_trailingFourWeekF(), 
    l1_trailingEightWeekF(), 
    l0_trailingEightWeekF(), 
    l1_trailingTwelveWeekF(), 
    l0_trailingTwelveWeekF(), 
    companyTotalSalesF()])

  ///////////////////////////////// KPI DATA

  /* % YoY YTD SALES */
  const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l0_salesByFyYtd, 'yoyYtdSales')
  const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l1_salesByFyYtd, 'yoyYtdSales')
  
  /* % COMPANY SALES */
  const l1_percent_companySales = calcPercentSalesCol(companyTotalSales[0], l1_salesPeriodToDate, 'percentCompanySales')
  const l0_percent_companySales = calcPercentSalesCol(companyTotalSales[0], l0_salesPeriodToDate, 'percentCompanySales')

  /* % PROGRAM SALES */
  let l1_percent_programSales = []
  let l0_percent_programSales = []
  if (config.baseFilters.program !== null) {
    const l0_program_salesPeriodToDate = await l0_program_getSalesPeriodToDate(config, config.totals.startDatePrimary, config.totals.endDatePrimary, config.baseFilters.program)
    l1_percent_programSales = calcPercentSalesCol(l0_program_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentProgramSales')
    l0_percent_programSales = calcPercentSalesCol(l0_program_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentProgramSales')
  }

  /* % REPORT TOTAL */
  const l1_percent_reportTotal = calcPercentSalesCol(l0_salesPeriodToDate[0], l1_salesPeriodToDate, 'percentReportTotal')
  const l0_percent_reportTotal = calcPercentSalesCol(l0_salesPeriodToDate[0], l0_salesPeriodToDate, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = config.totals.endWeekPrimary - config.totals.startWeekPrimary + 1
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

  /* MOMENTUM */
  const l1_momentum = calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum')
  const l0_momentum = calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum')

  /* WEEKS INV ON HAND */
  const l1_weeksInvOnHand = !l1_fgInven.length ? [] : calcWeeksInvOnHand(l1_fgInven, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l0_weeksInvOnHand = !l0_fgInven.length ? [] : calcWeeksInvOnHand(l0_fgInven, l0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const l1_invAvailable = !l1_fgInven.length ? [] : calcInventoryAvailable(l1_fgInven, l1_fgPo, l1_so, 'invenAvailable')
  const l0_invAvailable = !l0_fgInven.length ? [] : calcInventoryAvailable(l0_fgInven, l0_fgPo, l0_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  const rowsFirstLevelDetail = await getRowsFirstLevelDetail(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)

  const totalsRow = [
    { totalRow: true, l1_label: `${config.baseFilters.itemType} SALES`, l2_label: `TOTAL`, datalevel: config.baseFilters.queryLevel, itemtype: config.baseFilters.itemType },
  ] // Need an l2_label of TOTAL for front config.totals.endDatePrimary styling
  const filterRow = [
    {
      filterRow: true,
      l1_label: `${`
                  ${config.baseFilters.program ? `prog: ${config.baseFilters.program}, ` : ``}
                  ${config.l1_filter ? `${config.baseFormat.l1_name}: ${config.l1_filter}, ` : ``}
                  ${config.l2_filter ? `${config.baseFormat.l2_name}: ${config.l2_filter}, ` : ``}
                  ${config.l3_filter ? `${config.baseFormat.l3_name}: ${config.l3_filter}, ` : ``}
                  ${config.l4_filter ? `${config.baseFormat.l4_name}: ${config.l4_filter}, ` : ``}
                  ${config.l5_filter ? `${config.baseFormat.l5_name}: ${config.l5_filter}, ` : ``}
                  ${config.trendFilters.customer ? `cust: ${config.trendFilters.customer}, ` : ``}
                  ${config.trendFilters.item ? `item: ${config.trendFilters.item}, ` : ``}
                  ${config.trendFilters.salesPerson ? `salesperson: ${config.trendFilters.salesPerson}, ` : ``}
                  ${config.trendFilters.country ? `country: ${config.trendFilters.country}, ` : ``}
                  ${config.trendFilters.state ? `state: ${config.trendFilters.state}, ` : ``}
                  ${config.trendFilters.export ? `usa vs export: ${config.trendFilters.export}, ` : ``}
                  ${config.trendFilters.northAmerica ? `north america vs foreign: ${config.trendFilters.northAmerica}, ` : ``}
                 `}`,
    },
  ] // shows at top of report

  // COMPILE FINAL ROW TEMPLATE
  const rowTemplate = [...rowsFirstLevelDetail, ...totalsRow]

  // map data into row template
  const rowTemplate_unflat = unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  const mappedSales = mapSalesToRowTemplates(
    [
      ...l0_trailingFourWeek,
      ...l1_trailingFourWeek,
      ...l0_trailingTwelveWeek,
      ...l1_trailingTwelveWeek,
      ...l1_salesProjByWk,
      ...l0_salesProjByWk,
      ...l1_salesProjPeriodToDate,
      ...l0_salesProjPeriodToDate,
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
      ...l1_salesByFy, 
      ...l0_salesByFy, 
      ...l1_salesByFyYtd, 
      ...l0_salesByFyYtd,
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
      ...l0_yoyYtd_companySales,
      ...l1_yoyYtd_companySales,
      ...l1_momentum,
      ...l0_momentum,
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
  let data = cleanLabelsForDisplay(flattenedMappedData, '')
    .sort((a, b) => {
      // if has includes total, put at config.totals.endDatePrimary
      if (a.l1_label < b.l1_label) return -1
      if (a.l1_label > b.l1_label) return 1
      return 0
    })
    .sort((a, b) => {
      // if has includes total, put at config.totals.endDatePrimary
      if (a.l2_filter?.includes('TOTAL')) return 1
      if (b.l2_filter?.includes('TOTAL')) return -1
      return 0
    }) // no label in total row, first col
  data = [...filterRow, ...data]



  const trendColsCalMoByRangeF = !config.trends.calMonths ? skip() : () => {return  getTrendColsCalMonths(config)}
  const trendColsSales_byPeriodF = !config.trends.fiscalPeriods ? skip() : () => {return  getDateEndPerFiscalPeriodByRange(config.totals.yearPrimary, config)}
  const trendColsSalesF = !config.trends.fiscalWeeks ? skip() : () => { return getTrendColsWeeks(config)} 
  const trendColsSalesProjF = !config.trends.useProjection ? skip() : () => {return  getDateEndPerWeekByRange_pj(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}
  const trendColsSaByFyF = !config.trends.fyFullYear ? skip() : () => { return getFiscalYearCols()}
  const trendColsSaByFyYtdF = !config.trends.fyYtd ? skip() : () => { return  getFiscalYearYtdCols(2022, 2022)}

  // get so by week cols
  const start_so = await getEarliestShipWk(config)
  const end_so = await getLatestShipWk(config)

  const trendColsSoF = () => { return getDateEndPerWeekByRange_so(start_so, end_so, config)} 
  const trendColsSo_tgF = () => { return getDateEndPerWeekByRange_so_tg(start_so, end_so, config)} 
  const trendColsSo_untgF = () => { return getDateEndPerWeekByRange_so_untg(start_so, end_so, config)} 

  const [trendColsSales_byPeriod, trendColsCalMo, trendColsSalesProj, trendColsSales, trendColsSaByFy,trendColsSaByFyYtd, trendColsSo, trendColsSo_tg, trendColsSo_untg] = await Promise.all([trendColsSales_byPeriodF(), trendColsCalMoByRangeF(), trendColsSalesProjF(), trendColsSalesF(), trendColsSaByFyF(),trendColsSaByFyYtdF(), trendColsSoF(), trendColsSo_tgF(), trendColsSo_untgF()])

  // return
  return {
    data,
    cols: {
      trendColsSales_byPeriod,
      trendColsCalMo,
      trendColsSalesProj,
      trendColsSales,
      trendColsSaByFy,
      trendColsSaByFyYtd,
      labelCols,
      trendColsSo,
      trendColsSo_tg,
      trendColsSo_untg,
      columnConfigs,
      defaultTrend: {
        dataName: config.trends.useProjection ? columnConfigs.salesProjectionCol[0].dataName : columnConfigs.primarySalesTotalCol[0].dataName,
        colType: config.trends.useProjection ? columnConfigs.salesProjectionCol[0].colType : columnConfigs.primarySalesTotalCol[0].colType
      }
    },
  }
}





module.exports = buildDrillDown
