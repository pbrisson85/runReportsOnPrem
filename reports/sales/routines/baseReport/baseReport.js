const m = require('./import')

const buildReport = async config => {
  const salesDataPromises = [] // has sales price and margin
  const invenDataPromises = [] // has only cost
  const rowDataPromises = [] // labels only
  const trendColumnPromises = []
  const kpiHelperPromises = []

  ///////////////////////////////// INVENTORY DATA

  invenDataPromises.push(m.l0_getInv(config))
  invenDataPromises.push(m.l1_getInv(config))
  invenDataPromises.push(m.l2_getInv(config))
  invenDataPromises.push(m.l3_getInv(config))
  invenDataPromises.push(m.l4_getInv(config))
  invenDataPromises.push(m.l5_getInv(config))

  ///////////////////////////////// PURCHASE DATA

  invenDataPromises.push(m.l0_getOpenPo(config))
  invenDataPromises.push(m.l1_getOpenPo(config))
  invenDataPromises.push(m.l2_getOpenPo(config))
  invenDataPromises.push(m.l3_getOpenPo(config))
  invenDataPromises.push(m.l4_getOpenPo(config))
  invenDataPromises.push(m.l5_getOpenPo(config))

  ///////////////////////////////// SALES ORDERS

  // SO TOTAL
  salesDataPromises.push(m.l0_getSo(config))
  salesDataPromises.push(m.l1_getSo(config))
  salesDataPromises.push(m.l2_getSo(config))
  salesDataPromises.push(m.l3_getSo(config))
  salesDataPromises.push(m.l4_getSo(config))
  salesDataPromises.push(m.l5_getSo(config))

  // SO TREND
  salesDataPromises.push(m.l0_getSoTrend(config))
  salesDataPromises.push(m.l1_getSoTrend(config))
  salesDataPromises.push(m.l2_getSoTrend(config))
  salesDataPromises.push(m.l3_getSoTrend(config))
  salesDataPromises.push(m.l4_getSoTrend(config))
  salesDataPromises.push(m.l5_getSoTrend(config))

  ///////////////////////////////// SALES DATA

  // SALES YTD
  salesDataPromises.push(m.l0_getSalesTotalPrimary(config))
  salesDataPromises.push(m.l1_getSalesTotalPrimary(config))
  salesDataPromises.push(m.l2_getSalesTotalPrimary(config))
  salesDataPromises.push(m.l3_getSalesTotalPrimary(config))
  salesDataPromises.push(m.l4_getSalesTotalPrimary(config))
  salesDataPromises.push(m.l5_getSalesTotalPrimary(config))

  // TRENDS
  salesDataPromises.push(m.l0_getSalesTrend(config))
  salesDataPromises.push(m.l1_getSalesTrend(config))
  salesDataPromises.push(m.l2_getSalesTrend(config))
  salesDataPromises.push(m.l3_getSalesTrend(config))
  salesDataPromises.push(m.l4_getSalesTrend(config))
  salesDataPromises.push(m.l5_getSalesTrend(config))

  ///////////////////////////////// SALES KPIS

  // KPI HELPERS

  kpiHelperPromises.push(m.getCompanyTotalSales(config))
  kpiHelperPromises.push(m.getProgramTotalSales(config))
  kpiHelperPromises.push(m.getSpeciesGroupTotalSales(config))
  kpiHelperPromises.push(m.getReportTotalSales(config))

  const [companyTotalSales, programTotalSales, speciesGroupTotalSales, reportTotalSales] = await Promise.all(kpiHelperPromises)

  // AVE WEEKLY SALES
  salesDataPromises.push(m.l0_getAveSales(config))
  salesDataPromises.push(m.l1_getAveSales(config))
  salesDataPromises.push(m.l2_getAveSales(config))
  salesDataPromises.push(m.l3_getAveSales(config))
  salesDataPromises.push(m.l4_getAveSales(config))
  salesDataPromises.push(m.l5_getAveSales(config))

  // % COMPANY SALES
  salesDataPromises.push(m.l0_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  salesDataPromises.push(m.l1_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  salesDataPromises.push(m.l2_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  salesDataPromises.push(m.l3_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  salesDataPromises.push(m.l4_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  salesDataPromises.push(m.l5_getPercentSales(config, companyTotalSales, 'percentCompanySales'))

  // % PROGRAM SALES
  salesDataPromises.push(m.l0_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  salesDataPromises.push(m.l1_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  salesDataPromises.push(m.l2_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  salesDataPromises.push(m.l3_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  salesDataPromises.push(m.l4_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  salesDataPromises.push(m.l5_getPercentSales(config, programTotalSales, 'percentProgramSales'))

  // % SPECIES GROUP SALES
  salesDataPromises.push(m.l0_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  salesDataPromises.push(m.l1_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  salesDataPromises.push(m.l2_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  salesDataPromises.push(m.l3_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  salesDataPromises.push(m.l4_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  salesDataPromises.push(m.l5_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))

  // % REPORT SALES
  salesDataPromises.push(m.l0_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  salesDataPromises.push(m.l1_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  salesDataPromises.push(m.l2_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  salesDataPromises.push(m.l3_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  salesDataPromises.push(m.l4_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  salesDataPromises.push(m.l5_getPercentSales(config, reportTotalSales, 'percentReportTotal'))

  ///////////////////////////////// ROW LABELS
  rowDataPromises.push(m.l0_getRowLabels(config))
  rowDataPromises.push(m.l1_getRowLabels(config))
  rowDataPromises.push(m.l2_getRowLabels(config))
  rowDataPromises.push(m.l3_getRowLabels(config))
  rowDataPromises.push(m.l4_getRowLabels(config))
  rowDataPromises.push(m.l5_getRowLabels(config))

  ///////////////////////////////// TREND COLUMNS
  trendColumnPromises.push(m.getTrendColsSales(config))
  trendColumnPromises.push(m.getTrendColsSo(config))

  /* RUN DATA */

  const salesDataResults = await Promise.all(salesDataPromises)
  const salesData = salesDataResults.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  const invenDataResults = await Promise.all(invenDataPromises)
  const invenData = invenDataResults.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  const rowDataResults = await Promise.all(rowDataPromises)
  const rowData = rowDataResults.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  const trendColumnResults = await Promise.all(trendColumnPromises)
  const trendColumns = trendColumnResults.reduce((acc, cur) => {
    return acc.concat(cur)
  })

  // KPI CALCULATIONS

  // // WEEKS INV ON HAND
  // const l0_weeksInvOnHand = m.calcWeeksInvOnHand(l0_InvR, l0_aveWeeklySales, 'weeksInvenOnHand')
  // const l1_weeksInvOnHand = m.calcWeeksInvOnHand(l1_InvR, l1_aveWeeklySales, 'weeksInvenOnHand')
  // const l2_weeksInvOnHand = m.calcWeeksInvOnHand(l2_InvR, l2_aveWeeklySales, 'weeksInvenOnHand')
  // const l3_weeksInvOnHand = config.baseFormat.l3_field ? m.calcWeeksInvOnHand(l3_InvR, l3_aveWeeklySales, 'weeksInvenOnHand') : []
  // const l4_weeksInvOnHand = config.baseFormat.l4_field ? m.calcWeeksInvOnHand(l4_InvR, l4_aveWeeklySales, 'weeksInvenOnHand') : []
  // const l5_weeksInvOnHand = config.baseFormat.l5_field ? m.calcWeeksInvOnHand(l5_InvR, l5_aveWeeklySales, 'weeksInvenOnHand') : []

  // // INVENTORY AVAILABLE
  // const l0_invAvailable = m.calcInventoryAvailable(l0_InvR, l0_OpenPoR, l0_soR, 'invenAvailable')
  // const l1_invAvailable = m.calcInventoryAvailable(l1_InvR, l1_OpenPoR, l1_soR, 'invenAvailable')
  // const l2_invAvailable = m.calcInventoryAvailable(l2_InvR, l2_OpenPoR, l2_soR, 'invenAvailable')
  // const l3_invAvailable = config.baseFormat.l3_field ? m.calcInventoryAvailable(l3_InvR, l3_OpenPoR, l3_soR, 'invenAvailable') : []
  // const l4_invAvailable = config.baseFormat.l4_field ? m.calcInventoryAvailable(l4_InvR, l4_OpenPoR, l4_soR, 'invenAvailable') : []
  // const l5_invAvailable = config.baseFormat.l5_field ? m.calcInventoryAvailable(l5_InvR, l5_OpenPoR, l5_soR, 'invenAvailable') : []

  /* BUILD ROW MAP */

  const rowTemplate = m.sortRowTemplate(rowData)
  let keyMap = {}
  for (let i = 0; i < config.baseFormat.groupingLevel; i++) {
    // build composite key for unflatten:
    keyMap[i + 1] = `l${i + 1}_label`
  }
  // { 1: 'l1_label', 2: 'l2_label' }, { 1: 'l1_label', 2: 'l2_label', 3: 'l3_label' }
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, keyMap)

  /* MAP DATA TO ROWS */

  const mappedSales = m.mapSalesToRowTemplates(salesData, rowTemplate_unflat, config)
  const mappedInven = m.mapInvenToRowTemplates(invenData, rowTemplate_unflat, config)
  const mappedData = m.combineMappedRows(mappedSales, mappedInven)
  const flattenedMappedData = Object.values(mappedData)
  const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  // Add data to hardcoded columns
  let columnConfigsTagged = m.addDataToSalesTotalCol(config, m.columnConfigs) // adds startDate, endDate, and displayName to the sales totals col
  columnConfigsTagged = m.addDataToSoTotalCol(config, m.columnConfigs) // adds statDate, endDate, and displayName to the sales orders col

  // Add template to trend cols:
  const trendColumnsTagged = trendColumns.map(col => {
    return {
      ...col,
      ...m.trendColsTemplate,
      useProjection: config.trends.useProjection,
    }
  })

  /* 

  // % YoY YTD SALES
  const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l0_salesByFyYtdR, 'yoyYtdSales')
  const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l1_salesByFyYtdR, 'yoyYtdSales')
  const l2_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l2_salesByFyYtdR, 'yoyYtdSales')
  const l3_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l3_field ? m.calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l4_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l4_field ? m.calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l5_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l5_field ? m.calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales') : [] 
    
  // WEEKS INV ON HAND 
  const l0_weeksInvOnHand = m.calcWeeksInvOnHand(l0_InvR, l0_aveWeeklySales, 'weeksInvenOnHand')
  const l1_weeksInvOnHand = m.calcWeeksInvOnHand(l1_InvR, l1_aveWeeklySales, 'weeksInvenOnHand')
  const l2_weeksInvOnHand = m.calcWeeksInvOnHand(l2_InvR, l2_aveWeeklySales, 'weeksInvenOnHand')
  const l3_weeksInvOnHand = config.baseFormat.l3_field ? m.calcWeeksInvOnHand(l3_InvR, l3_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l4_weeksInvOnHand = config.baseFormat.l4_field ? m.calcWeeksInvOnHand(l4_InvR, l4_aveWeeklySales, 'weeksInvenOnHand') : [] 
  const l5_weeksInvOnHand = config.baseFormat.l5_field ? m.calcWeeksInvOnHand(l5_InvR, l5_aveWeeklySales, 'weeksInvenOnHand') : [] 
  
  // INVENTORY AVAILABLE 
  const l0_invAvailable = m.calcInventoryAvailable(l0_InvR, l0_OpenPoR, l0_soR, 'invenAvailable')
  const l1_invAvailable = m.calcInventoryAvailable(l1_InvR, l1_OpenPoR, l1_soR, 'invenAvailable')
  const l2_invAvailable = m.calcInventoryAvailable(l2_InvR, l2_OpenPoR, l2_soR, 'invenAvailable')
  const l3_invAvailable = config.baseFormat.l3_field ? m.calcInventoryAvailable(l3_InvR, l3_OpenPoR, l3_soR, 'invenAvailable') : []
  const l4_invAvailable = config.baseFormat.l4_field ? m.calcInventoryAvailable(l4_InvR, l4_OpenPoR, l4_soR, 'invenAvailable') : []
  const l5_invAvailable = config.baseFormat.l5_field ? m.calcInventoryAvailable(l5_InvR, l5_OpenPoR, l5_soR, 'invenAvailable') : []
  */

  return {
    data,
    cols: {
      trendColumns: trendColumnsTagged,
      labelCols: config.labelCols,
      columnConfigs: columnConfigsTagged,
    },
  }
}

module.exports = buildReport
