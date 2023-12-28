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
  kpiHelperPromises.push(m.getSpeciesGroupTotalSales(config))
  kpiHelperPromises.push(m.getReportTotalSales(config))

  const [companyTotalSales, programTotalSales, speciesGroupTotalSales, reportTotalSales] = await Promise.all(kpiHelperPromises)

  // AVE WEEKLY SALES
  queryDataPromises.push(m.l0_getAveSales(config, useProjection))
  queryDataPromises.push(m.l1_getAveSales(config, trendQuery, useProjection))

  // % COMPANY SALES
  queryDataPromises.push(m.l0_getPercentSales(config, startDate, endDate, useProjection, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l1_getPercentSales(config, startDate, endDate, trendQuery, useProjection, companyTotalSales, 'percentCompanySales'))
  // % PROGRAM SALES
  queryDataPromises.push(m.l0_getPercentSales(config, startDate, endDate, useProjection, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l1_getPercentSales(config, startDate, endDate, trendQuery, useProjection, programTotalSales, 'percentProgramSales'))
  // % SPECIES GROUP SALES
  const pctSpecGrpSalesInputs = [config, startDate, endDate, trendQuery, useProjection, speciesGroupTotalSales, 'percentSpeciesGroupSales']
  queryDataPromises.push(m.l0_getPercentSales(config, startDate, endDate, useProjection, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l1_getPercentSales(...pctSpecGrpSalesInputs))
  // % REPORT SALES
  queryDataPromises.push(m.l0_getPercentSales(config, startDate, endDate, useProjection, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l1_getPercentSales(config, startDate, endDate, trendQuery, useProjection, reportTotalSales, 'percentReportTotal'))

  ///////////////////////////////// ROW LABELS

  rowDataPromises.push(m.l0_getRowLabels(config))
  rowDataPromises.push(m.l1_getRowLabels(config, startDate, endDate, trendQuery))

  ///////////////////////////////// TREND COLUMNS

  trendColumnPromises.push(m.getTrendColsSales(config))
  trendColumnPromises.push(m.getTrendColsSo(config))

  /* RUN DATA */

  const queryDataResults = await Promise.all(queryDataPromises)
  const queryData = queryDataResults.reduce((acc, cur) => {
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

  // // % YoY YTD SALES
  //m.calcYoyYtdSalesCol(l0_salesByFyYtd, 'yoyYtdSales')
  //m.calcYoyYtdSalesCol(l1_salesByFyYtd, 'yoyYtdSales')

  // // WEEKS INV ON HAND
  // m.calcWeeksInvOnHand(l1_inven, l1_aveWeeklySales, 'weeksInvenOnHand')
  // m.calcWeeksInvOnHand(l0_inven, l0_aveWeeklySales, 'weeksInvenOnHand')

  // // INVENTORY AVAILABLE
  // m.calcInventoryAvailable(l1_inven, l1_OpenPo, l1_so, 'invenAvailable')
  // m.calcInventoryAvailable(l0_inven, l0_OpenPo, l0_so, 'invenAvailable')

  /* BUILD ROW MAP */

  const rowTemplate = m.sortRowTemplate(rowData)
  const key = { 1: 'l1_label' }
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, key)

  /* MAP DATA TO ROWS */

  const mappedData = m.mapDataToRowTemplates(queryData, rowTemplate_unflat, config, (viewTrend = true))
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

  return {
    data,
    cols: {
      trendColumns: trendColumnsTagged,
      labelCols: config.labelCols,
      columnConfigs: columnConfigsTagged,
    },
  }
}

module.exports = buildDrillDown
