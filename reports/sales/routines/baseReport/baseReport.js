const m = require('./import')

const buildReport = async config => {
  const queryDataPromises = []
  const rowDataPromises = []
  const kpiHelperPromises = []

  ///////////////////////////////// INVENTORY DATA

  queryDataPromises.push(m.l0_getInv(config))
  queryDataPromises.push(m.l1_getInv(config))
  queryDataPromises.push(m.l2_getInv(config))
  queryDataPromises.push(m.l3_getInv(config))
  queryDataPromises.push(m.l4_getInv(config))
  queryDataPromises.push(m.l5_getInv(config))

  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l0_getOpenPo(config))
  queryDataPromises.push(m.l1_getOpenPo(config))
  queryDataPromises.push(m.l2_getOpenPo(config))
  queryDataPromises.push(m.l3_getOpenPo(config))
  queryDataPromises.push(m.l4_getOpenPo(config))
  queryDataPromises.push(m.l5_getOpenPo(config))

  ///////////////////////////////// SALES ORDERS

  // SO TOTAL
  queryDataPromises.push(m.l0_getSo(config))
  queryDataPromises.push(m.l1_getSo(config))
  queryDataPromises.push(m.l2_getSo(config))
  queryDataPromises.push(m.l3_getSo(config))
  queryDataPromises.push(m.l4_getSo(config))
  queryDataPromises.push(m.l5_getSo(config))

  // SO TREND
  queryDataPromises.push(m.l0_getSoTrend(config))
  queryDataPromises.push(m.l1_getSoTrend(config))
  queryDataPromises.push(m.l2_getSoTrend(config))
  queryDataPromises.push(m.l3_getSoTrend(config))
  queryDataPromises.push(m.l4_getSoTrend(config))
  queryDataPromises.push(m.l5_getSoTrend(config))

  ///////////////////////////////// SALES DATA

  // SALES YTD
  queryDataPromises.push(m.l0_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l1_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l2_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l3_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l4_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l5_getSalesTotalPrimary(config))

  // TRENDS
  queryDataPromises.push(m.l0_getSalesTrend(config))
  queryDataPromises.push(m.l1_getSalesTrend(config))
  queryDataPromises.push(m.l2_getSalesTrend(config))
  queryDataPromises.push(m.l3_getSalesTrend(config))
  queryDataPromises.push(m.l4_getSalesTrend(config))
  queryDataPromises.push(m.l5_getSalesTrend(config))

  ///////////////////////////////// SALES KPIS

  // KPI HELPERS

  kpiHelperPromises.push(m.getCompanyTotalSales(config))
  kpiHelperPromises.push(m.getProgramTotalSales(config))
  kpiHelperPromises.push(m.getSpeciesGroupTotalSales(config))
  kpiHelperPromises.push(m.getReportTotalSales(config))

  const [companyTotalSales, programTotalSales, speciesGroupTotalSales, reportTotalSales] = await Promise.all(kpiHelperPromises)

  // AVE WEEKLY SALES
  queryDataPromises.push(m.l0_getAveSales(config))
  queryDataPromises.push(m.l1_getAveSales(config))
  queryDataPromises.push(m.l2_getAveSales(config))
  queryDataPromises.push(m.l3_getAveSales(config))
  queryDataPromises.push(m.l4_getAveSales(config))
  queryDataPromises.push(m.l5_getAveSales(config))

  // % COMPANY SALES
  queryDataPromises.push(m.l0_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l1_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l2_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l3_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l4_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l5_getPercentSales(config, companyTotalSales, 'percentCompanySales'))

  // % PROGRAM SALES
  queryDataPromises.push(m.l0_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l1_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l2_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l3_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l4_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l5_getPercentSales(config, programTotalSales, 'percentProgramSales'))

  // % SPECIES GROUP SALES
  queryDataPromises.push(m.l0_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l1_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l2_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l3_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l4_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l5_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))

  // % REPORT SALES
  queryDataPromises.push(m.l0_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l1_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l2_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l3_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l4_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l5_getPercentSales(config, reportTotalSales, 'percentReportTotal'))

  ///////////////////////////////// INVEN KPIS

  // WEEKS INV ON HAND

  queryDataPromises.push(m.l0_getWeeksOnHand(config))
  queryDataPromises.push(m.l1_getWeeksOnHand(config))
  queryDataPromises.push(m.l2_getWeeksOnHand(config))
  queryDataPromises.push(m.l3_getWeeksOnHand(config))
  queryDataPromises.push(m.l4_getWeeksOnHand(config))
  queryDataPromises.push(m.l5_getWeeksOnHand(config))

  ///////////////////////////////// ROW LABELS
  rowDataPromises.push(m.l0_getRowLabels(config))
  rowDataPromises.push(m.l1_getRowLabels(config))
  rowDataPromises.push(m.l2_getRowLabels(config))
  rowDataPromises.push(m.l3_getRowLabels(config))
  rowDataPromises.push(m.l4_getRowLabels(config))
  rowDataPromises.push(m.l5_getRowLabels(config))

  /* RUN DATA */

  const queryDataResults = await Promise.all(queryDataPromises)
  const queryData = queryDataResults.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  const rowDataResults = await Promise.all(rowDataPromises)
  const rowData = rowDataResults.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  // KPI CALCULATIONS

  // // INVENTORY AVAILABLE
  // queryDataPromises.push(m.calcInventoryAvailable(l0_InvR, l0_OpenPoR, l0_soR, 'invenAvailable'))
  // queryDataPromises.push(m.calcInventoryAvailable(l1_InvR, l1_OpenPoR, l1_soR, 'invenAvailable'))
  // queryDataPromises.push(m.calcInventoryAvailable(l2_InvR, l2_OpenPoR, l2_soR, 'invenAvailable'))
  // queryDataPromises.push(m.calcInventoryAvailable(l3_InvR, l3_OpenPoR, l3_soR, 'invenAvailable'))
  // queryDataPromises.push(m.calcInventoryAvailable(l4_InvR, l4_OpenPoR, l4_soR, 'invenAvailable'))
  // queryDataPromises.push(m.calcInventoryAvailable(l5_InvR, l5_OpenPoR, l5_soR, 'invenAvailable'))

  // // % YoY YTD SALES
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l0_salesByFyYtdR, 'yoyYtdSales'))
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l1_salesByFyYtdR, 'yoyYtdSales'))
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l2_salesByFyYtdR, 'yoyYtdSales'))
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l3_salesByFyYtdR, 'yoyYtdSales'))
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l4_salesByFyYtdR, 'yoyYtdSales'))
  // queryDataPromises.push(m.calcYoyYtdSalesCol(l5_salesByFyYtdR, 'yoyYtdSales'))

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

  const mappedData = m.mapDataToRowTemplates(queryData, rowTemplate_unflat, config, (viewTrend = false))
  const flattenedMappedData = Object.values(mappedData)
  const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  /* COLUMNS */
  const columns = await m.getColumns(config)

  return {
    data,
    cols: {
      labelCols: config.labelCols,
      ...columns,
    },
    baseConfig: config.baseConfig, // pass back for slice and detail reports
  }
}

module.exports = buildReport
