const m = require('./import')


const buildDrillDown = async (labelCols, config, trendQuery, useProjection, startDate, endDate) => {
  const queryDataPromises = []
  const rowDataPromises = []
  const trendColumnPromises = []
  const kpiHelperPromises = []


  ///////////////////////////////// INVENTORY DATA

  queryDataPromises.push(m.l1_getInven(config, trendQuery))
  queryDataPromises.push(m.l0_getInven(config, trendQuery))
 
  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l1_getOpenPo(config, trendQuery))
  queryDataPromises.push(m.l0_getOpenPo(config, trendQuery))

  ///////////////////////////////// SALES ORDERS

  // SO TOTAL
  queryDataPromises.push(m.l1_getSo(config, trendQuery))
  queryDataPromises.push(m.l0_getSo(config))

  // SO TREND
  queryDataPromises.push(m.l1_getSoTrend(config, trendQuery))
  queryDataPromises.push(m.l0_getSoTrend(config))

  ///////////////////////////////// SALES DATA

  // SALES YTD
  queryDataPromises.push(m.l1_getSales(config, startDate, endDate, trendQuery, useProjection))
  queryDataPromises.push(m.l0_getSales(config, startDate, endDate, useProjection))

  // TRENDS
  queryDataPromises.push(m.l1_getSalesTrend(config, trendQuery, useProjection))
  queryDataPromises.push(m.l0_getSalesTrend(config, useProjection))

  ///////////////////////////////// SALES KPIS

  // KPI HELPERS
  kpiHelperPromises.push(m.getCompanyTotalSales(config))
  kpiHelperPromises.push(m.getProgramTotalSales(config))
  // kpiHelperPromises.push(m.getSpeciesGroupTotalSales(config))
  // kpiHelperPromises.push(m.getReportTotalSales(config))

  const [companyTotalSales, programTotalSales, speciesGroupTotalSales, reportTotalSales] = await Promise.all(kpiHelperPromises)
  
  ///////////////////////////////// KPI DATA
  
  m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '2wk Rolling')}
  m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 1, config.totals.endWeekPrimary, config.totals.yearPrimary, '2wk Rolling')}

  m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '4wk Rolling')}
  m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 3, config.totals.endWeekPrimary, config.totals.yearPrimary, '4wk Rolling')}

  m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '8wk Rolling')}
  m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 7, config.totals.endWeekPrimary, config.totals.yearPrimary, '8wk Rolling')}

  m.l1_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, trendQuery, config.totals.yearPrimary, '12wk Rolling')}
  m.l0_getSalesWkDriven(config, config.totals.endWeekPrimary - 11, config.totals.endWeekPrimary, config.totals.yearPrimary, '12wk Rolling')}



  ///////////////////////////////// KPI DATA

  /* % YoY YTD SALES */
  //m.calcYoyYtdSalesCol(l0_salesByFyYtd, 'yoyYtdSales')
  //m.calcYoyYtdSalesCol(l1_salesByFyYtd, 'yoyYtdSales')
  
  /* % COMPANY SALES */
  m.calcPercentSalesCol(companyTotalSales, l1_sales, 'percentCompanySales')
  m.calcPercentSalesCol(companyTotalSales, l0_sales, 'percentCompanySales')

  /* % PROGRAM SALES */
  m.calcPercentSalesCol(programTotalSales, l1_sales, 'percentProgramSales')
  m.calcPercentSalesCol(programTotalSales, l0_sales, 'percentProgramSales')

  /* % REPORT TOTAL */
  m.calcPercentSalesCol(l0_sales[0], l1_sales, 'percentReportTotal')
  m.calcPercentSalesCol(l0_sales[0], l0_sales, 'percentReportTotal')

  /* AVE WEEKLY SALES */

  m.calcAveWeeklySales(l1_sales, 'aveWeeklySales', weeks)
  m.calcAveWeeklySales(l0_sales, 'aveWeeklySales', weeks)

  m.calcAveWeeklySales(l1_trailingTwoWeek, 'twoWkAveSales', 2)
  m.calcAveWeeklySales(l0_trailingTwoWeek, 'twoWkAveSales', 2)

  m.calcAveWeeklySales(l1_trailingFourWeek, 'fourWkAveSales', 4)
  m.calcAveWeeklySales(l0_trailingFourWeek, 'fourWkAveSales', 4)

  m.calcAveWeeklySales(l1_trailingEightWeek, 'eightWkAveSales', 8)
  m.calcAveWeeklySales(l0_trailingEightWeek, 'eightWkAveSales', 8)

  m.calcAveWeeklySales(l1_trailingTwelveWeek, 'twelveWkAveSales', 12)
  m.calcAveWeeklySales(l0_trailingTwelveWeek, 'twelveWkAveSales', 12)

  /* MOMENTUM 4Wk Ave Vs 12 Wk Ave */
  m.calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum (4wk vs 12 wk)')
  m.calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum (4wk vs 12 wk)')

  /* WEEKS INV ON HAND */
  m.calcWeeksInvOnHand(l1_inven, l1_aveWeeklySales, 'weeksInvenOnHand')
  m.calcWeeksInvOnHand(l0_inven, l0_aveWeeklySales, 'weeksInvenOnHand')

  /* INVENTORY AVAILABLE */
  m.calcInventoryAvailable(l1_inven, l1_OpenPo, l1_so, 'invenAvailable')
  m.calcInventoryAvailable(l0_inven, l0_OpenPo, l0_so, 'invenAvailable')

  ///////////////////////////////// ROWS
  m.getRowsFirstLevelDetail(config, startDate, endDate, trendQuery)

  const totalsRow = [
    { totalRow: true, l1_label: `TOTAL`, datalevel: config.baseFilters.queryLevel, itemtype: config.baseFilters.itemType },
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
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, {
    1: 'l1_label',
  })

  const mappedSales = m.mapSalesToRowTemplates( [],rowTemplate_unflat, config, viewTrend = true)

  const mappedData = m.combineMappedRows(mappedSales, mappedInven)

  // clean out rows with zero activity
  Object.keys(mappedData).forEach(key => {
    // If the length = 1, then there is only the one label and no other columns are populated
    if (Object.keys(mappedData[key]).length === 1) {
      delete mappedData[key]
    }
  })

  const flattenedMappedData = Object.values(mappedData)
  let data = m.cleanLabelsForDisplay(flattenedMappedData, config)
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


  m.getTrendColsSales(config)
  m.getTrendColsSo(config)


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
        dataName: m.columnConfigs.primarySalesTotalCol[0].dataName,
        colType: m.columnConfigs.primarySalesTotalCol[0].colType
      }
    },
  }
}





module.exports = buildDrillDown
