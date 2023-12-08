const m = require('./import')

// Note that KPI data does not have the logic cleaned up to handle useSalesProjection like the base report does at this time.

const buildDrillDown = async (labelCols, config, trendQuery, useProjection) => {
  const skip = () => {
    return () => {
      return []
    }
  }

  ///////////////////////////////// INVENTORY DATA
  /* TOTAL FG (FG) */
  const l1_invenF = () => { return m.l1_getInven(config, trendQuery)}
  const l0_invenF = () => { return m.l0_getInven(config, trendQuery)}
 

  /* PURCHASE ORDER */
  const l1_OpenPoF = () => { return m.l1_getOpenPo(config, trendQuery)}
  const l0_OpenPoF = () => { return m.l0_getOpenPo(config, trendQuery)}

  // ///////////////////////////////// SALES ORDERS
  /* ALL SO */
  const l1_soF = () => { return m.l1_getSo(config, trendQuery)}
  const l0_soF = () => { return m.l0_getSo(config)}

  const l1_soTrendF = () => { return m.l1_getSoTrend(config, trendQuery)}
  const l0_soTrendF = () => { return m.l0_getSoTrend(config)}

  // ///////////////////////////////// SALES DATA

  /* SALES */

  const l1_salesTrendF = !config.trends.queryGrouping ? skip() :  () => { return m.l1_getSalesTrend(config, trendQuery, useProjection)}
  const l0_salesTrendF = !config.trends.queryGrouping ? skip() :  () => { return m.l0_getSalesTrend(config, useProjection)}

  const l1_salesF = () => { return m.l1_getSales(config, startDate, endDate, trendQuery, useProjection)}
  const l0_salesF = () => { return m.l0_getSales(config, startDate, endDate, useProjection)}

  /* KPI Data */
  
  const l1_trailingTwoWeekF = config.totals.endWeekPrimary < 2 ? skip() : () => { return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '2wk Rolling')}
  const l0_trailingTwoWeekF = config.totals.endWeekPrimary < 2 ? skip() : () => { return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}

  const l1_trailingFourWeekF = config.totals.endWeekPrimary < 4 ? skip() : () => { return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '4wk Rolling')}
  const l0_trailingFourWeekF = config.totals.endWeekPrimary < 4 ? skip() : () => { return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}

  const l1_trailingEightWeekF = config.totals.endWeekPrimary < 8 ? skip() : () => { return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '8wk Rolling')}
  const l0_trailingEightWeekF = config.totals.endWeekPrimary < 8 ? skip() : () => { return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}

  const l1_trailingTwelveWeekF = config.totals.endWeekPrimary < 12 ? skip() : () => { return m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '12wk Rolling')}
  const l0_trailingTwelveWeekF = config.totals.endWeekPrimary < 12 ? skip() : () => { return m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}

  const companyTotalSalesF = () => { return m.getCompanyTotalSales(config.totals.startDatePrimary, config.totals.endDatePrimary, config)}

  const [
    l1_inven, 
    l0_inven, 
    l1_OpenPo, 
    l0_OpenPo, 
    l1_so, 
    l0_so, 
    l1_soTrend, 
    l0_soTrend, 
    l1_salesTrend, 
    l0_salesTrend, 
    l1_sales, 
    l0_sales, 
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
    l1_invenF(), 
    l0_invenF(), 
    l1_OpenPoF(), 
    l0_OpenPoF(), 
    l1_soF(), 
    l0_soF(), 
    l1_soTrendF(), 
    l0_soTrendF(), 
    l1_salesTrendF(), 
    l0_salesTrendF(), 
    l1_salesF(), 
    l0_salesF(), 
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
  //const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l0_salesByFyYtd, 'yoyYtdSales')
  //const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : calcYoyYtdSalesCol(l1_salesByFyYtd, 'yoyYtdSales')
  
  /* % COMPANY SALES */
  const l1_percent_companySales = m.calcPercentSalesCol(companyTotalSales[0], l1_sales, 'percentCompanySales')
  const l0_percent_companySales = m.calcPercentSalesCol(companyTotalSales[0], l0_sales, 'percentCompanySales')

  /* % PROGRAM SALES */
  let l1_percent_programSales = []
  let l0_percent_programSales = []
  if (config.baseFilters.program !== null) {
    const l0_program_sales = await m.l0_program_getsales(config, config.totals.startDatePrimary, config.totals.endDatePrimary, config.baseFilters.program)
    l1_percent_programSales = m.calcPercentSalesCol(l0_program_sales[0], l1_sales, 'percentProgramSales')
    l0_percent_programSales = m.calcPercentSalesCol(l0_program_sales[0], l0_sales, 'percentProgramSales')
  }

  /* % REPORT TOTAL */
  const l1_percent_reportTotal = m.calcPercentSalesCol(l0_sales[0], l1_sales, 'percentReportTotal')
  const l0_percent_reportTotal = m.calcPercentSalesCol(l0_sales[0], l0_sales, 'percentReportTotal')

  /* AVE WEEKLY SALES */
  const weeks = config.totals.endWeekPrimary - config.totals.startWeekPrimary + 1
  const l1_aveWeeklySales = m.calcAveWeeklySales(l1_sales, 'aveWeeklySales', weeks)
  const l0_aveWeeklySales = m.calcAveWeeklySales(l0_sales, 'aveWeeklySales', weeks)

  const l1_twoWkAveSales = m.calcAveWeeklySales(l1_trailingTwoWeek, 'twoWkAveSales', 2)
  const l0_twoWkAveSales = m.calcAveWeeklySales(l0_trailingTwoWeek, 'twoWkAveSales', 2)

  const l1_fourWkAveSales = m.calcAveWeeklySales(l1_trailingFourWeek, 'fourWkAveSales', 4)
  const l0_fourWkAveSales = m.calcAveWeeklySales(l0_trailingFourWeek, 'fourWkAveSales', 4)

  const l1_eightWkAveSales = m.calcAveWeeklySales(l1_trailingEightWeek, 'eightWkAveSales', 8)
  const l0_eightWkAveSales = m.calcAveWeeklySales(l0_trailingEightWeek, 'eightWkAveSales', 8)

  const l1_twelveWkAveSales = m.calcAveWeeklySales(l1_trailingTwelveWeek, 'twelveWkAveSales', 12)
  const l0_twelveWkAveSales = m.calcAveWeeklySales(l0_trailingTwelveWeek, 'twelveWkAveSales', 12)

  /* MOMENTUM */
  const l1_momentum = m.calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum')
  const l0_momentum = m.calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum')

  /* WEEKS INV ON HAND */
  const l1_weeksInvOnHand = !l1_inven.length ? [] : m.calcWeeksInvOnHand(l1_inven, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l0_weeksInvOnHand = !l0_inven.length ? [] : m.calcWeeksInvOnHand(l0_inven, l0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  const l1_invAvailable = !l1_inven.length ? [] : m.calcInventoryAvailable(l1_inven, l1_OpenPo, l1_so, 'invenAvailable')
  const l0_invAvailable = !l0_inven.length ? [] : m.calcInventoryAvailable(l0_inven, l0_OpenPo, l0_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  const rowsFirstLevelDetail = await m.getRowsFirstLevelDetail(config, config.totals.startDatePrimary, config.totals.endDatePrimary, trendQuery)

  const totalsRow = [
    { totalRow: true, l1_label: `${config.baseFilters.itemType} SALES`, l2_label: `TOTAL`, datalevel: config.baseFilters.queryLevel, itemtype: config.baseFilters.itemType },
  ] // Need an l2_label of TOTAL for front config.totals.endDatePrimary styling
  const filterRow = [
    {
      filterRow: true,
      l1_label: `${`
                  ${config.baseFilters.program ? `prog: ${config.baseFilters.program}, ` : ``}
                  ${config.baseFilters.l1_filter ? `${config.baseFormat.l1_name}: ${config.baseFilters.l1_filter}, ` : ``}
                  ${config.baseFilters.l2_filter ? `${config.baseFormat.l2_name}: ${config.baseFilters.l2_filter}, ` : ``}
                  ${config.baseFilters.l3_filter ? `${config.baseFormat.l3_name}: ${config.baseFilters.l3_filter}, ` : ``}
                  ${config.baseFilters.l4_filter ? `${config.baseFormat.l4_name}: ${config.baseFilters.l4_filter}, ` : ``}
                  ${config.baseFilters.l5_filter ? `${config.baseFormat.l5_name}: ${config.baseFilters.l5_filter}, ` : ``}
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

  const mappedSales = m.mapSalesToRowTemplates(
    [
      ...l0_trailingFourWeek,
      ...l1_trailingFourWeek,
      ...l0_trailingTwelveWeek,
      ...l1_trailingTwelveWeek,
      ...l1_salesTrend,
      ...l0_salesTrend,
      ...l1_sales,
      ...l0_sales,
      ...l1_so,
      ...l0_so,
      ...l1_soTrend,
      ...l0_soTrend,
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
      // ...l0_yoyYtd_companySales,
      // ...l1_yoyYtd_companySales,
      ...l1_momentum,
      ...l0_momentum,
    ],
    rowTemplate_unflat
  )

  const mappedInven = m.mapInvenToRowTemplates(
    [
      ...l1_inven,
      ...l0_inven,
      ...l1_OpenPo,
      ...l0_OpenPo,
      ...l1_weeksInvOnHand,
      ...l0_weeksInvOnHand,
      ...l1_invAvailable,
      ...l0_invAvailable,
    ],
    rowTemplate_unflat
  )

  const mappedData = m.combineMappedRows(mappedSales, mappedInven)

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 1, then there is only the one label and no other columns are populated
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  let data = m.cleanLabelsForDisplay(flattenedMappedData, '')
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


  const trendColsSalesF = !config.trends.queryGrouping ? skip() : () => {return  m.getTrendColsSales(config)} 
  const trendColsSoF = config.trends.queryGrouping ? () => {return  m.getTrendColsSo(config)} : skip()


  let columnConfigsTagged = m.addDataToSalesTotalCol(config, m.columnConfigs) // adds startDate, endDate, and displayName to the sales totals col
  columnConfigsTagged = m.addDataToSoTotalCol(config, m.columnConfigs) // adds statDate, endDate, and displayName to the sales orders col
  columnConfigsTagged = m.addDataToSalesTrendCol(config, m.columnConfigs) // adds useProjection data

  const [
    trendColsSales, 
    trendColsSo
  ] = await Promise.all
      ([
        trendColsSalesF(), 
        trendColsSoF()
      ])

  // return
  return {
    data,
    cols: {
      trendColsSales,
      labelCols,
      trendColsSo,
      columnConfigs: columnConfigsTagged,
      defaultTrend: {
        dataName: columnConfigs.primarySalesTotalCol[0].dataName,
        colType: columnConfigs.primarySalesTotalCol[0].colType
      }
    },
  }
}





module.exports = buildDrillDown
