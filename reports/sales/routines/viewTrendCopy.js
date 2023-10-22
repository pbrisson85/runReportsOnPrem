const {
  getDateEndPerWeekByRange,
  getDateEndPerWeekByRange_pj,
  getDateEndPerWeekByRange_so,
  getDateEndPerWeekByRange_so_tg,
  getDateEndPerWeekByRange_so_untg,
} = require('../../../database/queries/postgres/getDateEndPerWeek')
const { getFiscalYearCols, getFiscalYearYtdCols } = require('../../../database/queries/postgres/getFiscalYearCols')
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
} = require('../../../database/queries/postgres/viewTrend/getSalesTrendDateDriven')
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
const calcAveWeeklySales = require('../../../models/calcAveWeeklySales')
const calcWeeksInvOnHand = require('../../../models/calcWeeksInvOnHand')
const calcInventoryAvailable = require('../../../models/calcInventoryAvailable')
const columnConfigs = require('../data/baseCols/columns')

const buildDrillDown = async (labelCols, config, start, end, showFyTrend, startWeek, endWeek, trendQuery, year) => {
  const skip = () => {
    return () => {
      return []
    }
  }

  const { useProjection } = config.views
  console.log('useProjection', useProjection)

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

  /*SALES PROJECTIONS*/
  const l1_salesProjByWkF = !useProjection ? skip() : () => {return l1_getSalesProjByWk(config, start, end)}
  const l0_salesProjByWkF = !useProjection ? skip() : () => {return l0_getSalesProjByWk(config, start, end)}

  const l1_salesProjPeriodToDateF = !useProjection ? skip() : () => {return l1_getSalesProjPeriodToDate(config, start, end)}
  const l0_salesProjPeriodToDateF = !useProjection ? skip() : () => {return l0_getSalesProjPeriodToDate(config, start, end)}

  const l1_salesByFyF = () => { return l1_getSalesByFyYtd(config, start, end, false, trendQuery)}
  const l0_salesByFyF = () => { return l0_getSalesByFyYtd(config, start, end, false)}

  const l1_salesByFyYtdF = () => { return l1_getSalesByFyYtd(config, startWeek, endWeek, true, trendQuery)}
  const l0_salesByFyYtdF = () => { return l0_getSalesByFyYtd(config, startWeek, endWeek, true)}

  const l1_salesByWkF = () => { return l1_getSalesByWk(config, start, end, trendQuery)}
  const l0_salesByWkF = () => { return l0_getSalesByWk(config, start, end)}

  const l1_salesPeriodToDateF = () => { return l1_getSalesPeriodToDate(config, start, end, trendQuery)}
  const l0_salesPeriodToDateF = () => { return l0_getSalesPeriodToDate(config, start, end)}

  const l1_trailingTwoWeekF = endWeek < 2 ? skip() : () => { return l1_getSalesWkDriven(config, endWeek - 1, endWeek, trendQuery, year)}
  const l0_trailingTwoWeekF = endWeek < 2 ? skip() : () => { return l0_getSalesWkDriven(config, endWeek - 1, endWeek, year)}

  const l1_trailingFourWeekF = endWeek < 4 ? skip() : () => { return l1_getSalesWkDriven(config, endWeek - 3, endWeek, trendQuery, year)}
  const l0_trailingFourWeekF = endWeek < 4 ? skip() : () => { return l0_getSalesWkDriven(config, endWeek - 3, endWeek, year)}

  const l1_trailingEightWeekF = endWeek < 8 ? skip() : () => { return l1_getSalesWkDriven(config, endWeek - 7, endWeek, trendQuery, year)}
  const l0_trailingEightWeekF = endWeek < 8 ? skip() : () => { return l0_getSalesWkDriven(config, endWeek - 7, endWeek, year)}

  const l1_trailingTwelveWeekF = endWeek < 12 ? skip() : () => { return l1_getSalesWkDriven(config, endWeek - 11, endWeek, trendQuery, year)}
  const l0_trailingTwelveWeekF = endWeek < 12 ? skip() : () => { return l0_getSalesWkDriven(config, endWeek - 11, endWeek, year)}

  const companyTotalSalesF = () => { return getCompanyTotalSales(start, end, config)}

  const [l1_fgInven, l0_fgInven, l1_fgInTransit, l0_fgInTransit, l1_fgAtLoc, l0_fgAtLoc, l1_fgAtLoc_untagged, l0_fgAtLoc_untagged, l1_fgAtLoc_tagged, l0_fgAtLoc_tagged, l1_fgPo, l0_fgPo, l1_so, l0_so, l1_soTagged, l0_soTagged, l1_soUntagged, l0_soUntagged, l1_so_byWk, l0_so_byWk, l1_soTagged_byWk, l0_soTagged_byWk, l1_soUntagged_byWk, l0_soUntagged_byWk, l1_salesByFy, l0_salesByFy, l1_salesByFyYtd, l0_salesByFyYtd, l1_salesByWk, l0_salesByWk, l1_salesPeriodToDate, l0_salesPeriodToDate, l1_trailingTwoWeek, l0_trailingTwoWeek, l1_trailingFourWeek, l0_trailingFourWeek, l1_trailingEightWeek, l0_trailingEightWeek, l1_trailingTwelveWeek, l0_trailingTwelveWeek, companyTotalSales ] = await Promise.all([l1_fgInvenF(), l0_fgInvenF(), l1_fgInTransitF(), l0_fgInTransitF(), l1_fgAtLocF(), l0_fgAtLocF(), l1_fgAtLoc_untaggedF(), l0_fgAtLoc_untaggedF(), l1_fgAtLoc_taggedF(), l0_fgAtLoc_taggedF(), l1_fgPoF(), l0_fgPoF(), l1_soF(), l0_soF(), l1_soTaggedF(), l0_soTaggedF(), l1_soUntaggedF(), l0_soUntaggedF(), l1_so_byWkF(), l0_so_byWkF(), l1_soTagged_byWkF(), l0_soTagged_byWkF(), l1_soUntagged_byWkF(), l0_soUntagged_byWkF(), l1_salesByFyF(), l0_salesByFyF(), l1_salesByFyYtdF(), l0_salesByFyYtdF(), l1_salesByWkF(), l0_salesByWkF(), l1_salesPeriodToDateF(), l0_salesPeriodToDateF(), l1_trailingTwoWeekF(), l0_trailingTwoWeekF(), l1_trailingFourWeekF(), l0_trailingFourWeekF(), l1_trailingEightWeekF(), l0_trailingEightWeekF(), l1_trailingTwelveWeekF(), l0_trailingTwelveWeekF(), companyTotalSalesF()])

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

  const totalsRow = [
    { totalRow: true, l1_label: `${config.itemType} SALES`, l2_label: `TOTAL`, datalevel: config.queryLevel, itemtype: config.itemType },
  ] // Need an l2_label of TOTAL for front end styling
  const filterRow = [
    {
      filterRow: true,
      l1_label: `${`
                  ${config.program ? `prog: ${config.program}, ` : ``}
                  ${config.l1_filter ? `${config.l1_name}: ${config.l1_filter}, ` : ``}
                  ${config.l2_filter ? `${config.l2_name}: ${config.l2_filter}, ` : ``}
                  ${config.l3_filter ? `${config.l3_name}: ${config.l3_filter}, ` : ``}
                  ${config.l4_filter ? `${config.l4_name}: ${config.l4_filter}, ` : ``}
                  ${config.customer ? `cust: ${config.customer}, ` : ``}
                  ${config.item ? `item: ${config.item}, ` : ``}
                  ${config.salesPerson ? `salesperson: ${config.salesPerson}, ` : ``}
                  ${config.country ? `country: ${config.country}, ` : ``}
                  ${config.state ? `state: ${config.state}, ` : ``}
                  ${config.export ? `usa vs export: ${config.export}, ` : ``}
                  ${config.northAmerica ? `north america vs foreign: ${config.northAmerica}, ` : ``}
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
  let data = cleanLabelsForDisplay(flattenedMappedData, '')
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
  data = [...filterRow, ...data]

  const trendColsSalesF = () => { return getDateEndPerWeekByRange(start, end, config)} 

  // get data column names by fiscal year
  let trendColsSaByFyF = () => { return []}
  let trendColsSaByFyYtdF = () => { return []}
  if (showFyTrend) trendColsSaByFyF = () => { return getFiscalYearCols()} 
  if (showFyTrend) trendColsSaByFyYtdF = () => { return getFiscalYearYtdCols()} 

  // get so by week cols
  const start_so = await getEarliestShipWk(config)
  const end_so = await getLatestShipWk(config)

  const trendColsSoF = () => { return getDateEndPerWeekByRange_so(start_so, end_so, config)} 
  const trendColsSo_tgF = () => { return getDateEndPerWeekByRange_so_tg(start_so, end_so, config)} 
  const trendColsSo_untgF = () => { return getDateEndPerWeekByRange_so_untg(start_so, end_so, config)} 

  const [trendColsSales, trendColsSaByFy,trendColsSaByFyYtd, trendColsSo, trendColsSo_tg, trendColsSo_untg] = await Promise.all([trendColsSalesF(), trendColsSaByFyF(),trendColsSaByFyYtdF(), trendColsSoF(), trendColsSo_tgF(), trendColsSo_untgF()])

  // return
  return {
    data,
    cols: {
      trendColsSales,
      trendColsSaByFy,
      trendColsSaByFyYtd,
      labelCols,
      trendColsSo,
      trendColsSo_tg,
      trendColsSo_untg,
      columnConfigs,
      defaultTrend: {
        dataName: useProjection ? columnConfigs.salesProjectionCol[0].dataName : columnConfigs.totalsCol[0].dataName,
        colType: useProjection ? columnConfigs.salesProjectionCol[0].colType : columnConfigs.totalsCol[0].colType
      }
    },
  }
}

module.exports = buildDrillDown
