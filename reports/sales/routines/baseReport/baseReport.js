const m = require('./import')

const buildReport = async (config) => {
 
  const salesDataPromises = [] // has sales price and margin
  const invenDataPromises = [] // has only cost
  const rowDataPromises = [] // labels only
  const trendColumnPromises = []

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

  // AVE WEEKLY SALES
  salesDataPromises.push(m.l0_getAveSales(config))
  salesDataPromises.push(m.l1_getAveSales(config))
  salesDataPromises.push(m.l2_getAveSales(config))
  salesDataPromises.push(m.l3_getAveSales(config))
  salesDataPromises.push(m.l4_getAveSales(config))
  salesDataPromises.push(m.l5_getAveSales(config))

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
    useProjection: config.trends.useProjection
  }
})

  // % COMPANY SALES

  /* 

  const l0_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l0_reportSales, 'percentCompanySales')
  const l1_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l1_reportSales, 'percentCompanySales')
  const l2_percent_companySales = m.calcPercentSalesCol(companyTotalSalesR, l2_reportSales, 'percentCompanySales')
  const l3_percent_companySales = config.baseFormat.l3_field ? m.calcPercentSalesCol(companyTotalSalesR, l3_reportSales, 'percentCompanySales') : [] 
  const l4_percent_companySales = config.baseFormat.l4_field ? m.calcPercentSalesCol(companyTotalSalesR, l4_reportSales, 'percentCompanySales') : [] 
  const l5_percent_companySales = config.baseFormat.l5_field ? m.calcPercentSalesCol(companyTotalSalesR, l5_reportSales, 'percentCompanySales') : [] 
 

  const companyTotalSales = () => {return m.getCompanyTotalSales(config)}
  const programTotalSales = () => {return m.getProgramTotalSales(config)}
  const speciesGroupTotalSales = () => {return m.getSpeciesGroupTotalSales(config)}  

  // Define numerators and denominators to use
  let l0_reportSales = l0_salesPeriodToDateR
  let l1_reportSales = l1_salesPeriodToDateR
  let l2_reportSales = l2_salesPeriodToDateR
  let l3_reportSales = l3_salesPeriodToDateR
  let l4_reportSales = l4_salesPeriodToDateR
  let l5_reportSales = l5_salesPeriodToDateR

  // % YoY YTD SALES
  const l0_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l0_salesByFyYtdR, 'yoyYtdSales')
  const l1_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l1_salesByFyYtdR, 'yoyYtdSales')
  const l2_yoyYtd_companySales = !config.trends.fyYtd ? [] : m.calcYoyYtdSalesCol(l2_salesByFyYtdR, 'yoyYtdSales')
  const l3_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l3_field ? m.calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l4_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l4_field ? m.calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales') : [] 
  const l5_yoyYtd_companySales = !config.trends.fyYtd ? [] : config.baseFormat.l5_field ? m.calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales') : [] 

  

  // % PROGRAM SALES 
  const l0_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l0_reportSales, 'percentProgramSales')
  const l1_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l1_reportSales, 'percentProgramSales')
  const l2_percent_programSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(programTotalSalesR, l2_reportSales, 'percentProgramSales')
  const l3_percent_programSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l3_reportSales, 'percentProgramSales')
  const l4_percent_programSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l4_reportSales, 'percentProgramSales') 
  const l5_percent_programSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : m.calcPercentSalesCol(programTotalSalesR, l5_reportSales, 'percentProgramSales') 

  // % SPECIES GROUP SALES 
  // look up species group based on program
  const l0_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l0_reportSales, 'percentSpeciesGroupSales')
  const l1_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l1_reportSales, 'percentSpeciesGroupSales') 
  const l2_percent_speciesGroupSales = !config.baseFilters.program ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l2_reportSales, 'percentSpeciesGroupSales') 
  const l3_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l3_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l3_reportSales, 'percentSpeciesGroupSales')
  const l4_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l4_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l4_reportSales, 'percentSpeciesGroupSales')
  const l5_percent_speciesGroupSales = !config.baseFilters.program || !config.baseFormat.l5_field ? [] : m.calcPercentSalesCol(speciesGroupTotalSalesR[0], l5_reportSales, 'percentSpeciesGroupSales')
 
  // % REPORT TOTAL 
  const l0_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l0_reportSales, 'percentReportTotal')
  const l1_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l1_reportSales, 'percentReportTotal')
  const l2_percent_reportTotal = m.calcPercentSalesCol(l0_reportSales[0], l2_reportSales, 'percentReportTotal')
  const l3_percent_reportTotal = config.baseFormat.l3_field ? m.calcPercentSalesCol(l0_reportSales[0], l3_reportSales, 'percentReportTota') : [] 
  const l4_percent_reportTotal = config.baseFormat.l4_field ? m.calcPercentSalesCol(l0_reportSales[0], l4_reportSales, 'percentReportTota') : [] 
  const l5_percent_reportTotal = config.baseFormat.l5_field ? m.calcPercentSalesCol(l0_reportSales[0], l5_reportSales, 'percentReportTota') : [] 
  
  // MOMENTUM 
  const l0_momentum = m.calcMomentum(l0_fourWkAveSales, l0_twelveWkAveSales, 'momentum')
  const l1_momentum = m.calcMomentum(l1_fourWkAveSales, l1_twelveWkAveSales, 'momentum')
  const l2_momentum = m.calcMomentum(l2_fourWkAveSales, l2_twelveWkAveSales, 'momentum')
  const l3_momentum = m.calcMomentum(l3_fourWkAveSales, l3_twelveWkAveSales, 'momentum')
  const l4_momentum = m.calcMomentum(l4_fourWkAveSales, l4_twelveWkAveSales, 'momentum')
  const l5_momentum = m.calcMomentum(l5_fourWkAveSales, l5_twelveWkAveSales, 'momentum')

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
