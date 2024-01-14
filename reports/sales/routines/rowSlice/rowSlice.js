const m = require('./import')

const buildDrillDown = async (labelCols, config, trendQuery) => {
  const queryDataPromises = []
  const rowDataPromises = []
  const kpiHelperPromises = []

  ///////////////////////////////// INVENTORY DATA

  queryDataPromises.push(m.l1_getInven(config, trendQuery))
  queryDataPromises.push(m.l0_getInven(config))

  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l1_getOpenPo(config, trendQuery))
  queryDataPromises.push(m.l0_getOpenPo(config))

  ///////////////////////////////// SALES ORDERS

  // SO TOTAL
  queryDataPromises.push(m.l1_getSo(config, trendQuery))
  queryDataPromises.push(m.l0_getSo(config))

  // SO TREND
  queryDataPromises.push(m.l1_getSoTrend(config, trendQuery))
  queryDataPromises.push(m.l0_getSoTrend(config))

  ///////////////////////////////// SALES DATA

  // SALES YTD
  queryDataPromises.push(m.l1_getSales(config, trendQuery))
  queryDataPromises.push(m.l0_getSales(config))

  // TRENDS
  queryDataPromises.push(m.l1_getSalesTrend(config, trendQuery))
  queryDataPromises.push(m.l0_getSalesTrend(config))

  ///////////////////////////////// SALES KPIS

  // KPI HELPERS
  kpiHelperPromises.push(m.getCompanyTotalSales(config))
  kpiHelperPromises.push(m.getProgramTotalSales(config))
  kpiHelperPromises.push(m.getSpeciesGroupTotalSales(config))
  kpiHelperPromises.push(m.getReportTotalSales(config))

  const [companyTotalSales, programTotalSales, speciesGroupTotalSales, reportTotalSales] = await Promise.all(kpiHelperPromises)

  // AVE WEEKLY SALES
  queryDataPromises.push(m.l0_getAveSales(config))
  queryDataPromises.push(m.l1_getAveSales(config, trendQuery))
  // % COMPANY SALES
  queryDataPromises.push(m.l0_getPercentSales(config, companyTotalSales, 'percentCompanySales'))
  queryDataPromises.push(m.l1_getPercentSales(config, trendQuery, companyTotalSales, 'percentCompanySales'))
  // % PROGRAM SALES
  queryDataPromises.push(m.l0_getPercentSales(config, programTotalSales, 'percentProgramSales'))
  queryDataPromises.push(m.l1_getPercentSales(config, trendQuery, programTotalSales, 'percentProgramSales'))
  // % SPECIES GROUP SALES
  const pctSpecGrpSalesInputs = [config, trendQuery, speciesGroupTotalSales, 'percentSpeciesGroupSales']
  queryDataPromises.push(m.l0_getPercentSales(config, speciesGroupTotalSales, 'percentSpeciesGroupSales'))
  queryDataPromises.push(m.l1_getPercentSales(...pctSpecGrpSalesInputs))
  // % REPORT SALES
  queryDataPromises.push(m.l0_getPercentSales(config, reportTotalSales, 'percentReportTotal'))
  queryDataPromises.push(m.l1_getPercentSales(config, trendQuery, reportTotalSales, 'percentReportTotal'))

  ///////////////////////////////// INVEN KPIS

  // WEEKS INV ON HAND
  queryDataPromises.push(m.l0_getWeeksOnHand(config))
  queryDataPromises.push(m.l1_getWeeksOnHand(config, trendQuery))

  ///////////////////////////////// ROW LABELS

  rowDataPromises.push(m.l0_getRowLabels(config))
  rowDataPromises.push(m.l1_getRowLabels(config, trendQuery))

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

  // // % YoY YTD SALES
  //m.calcYoyYtdSalesCol(l0_salesByFyYtd, 'yoyYtdSales')
  //m.calcYoyYtdSalesCol(l1_salesByFyYtd, 'yoyYtdSales')

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

  /* COLUMNS */
  const columns = await getColumns(config)

  return {
    data,
    cols: {
      labelCols,
      ...columns,
    },
  }
}

module.exports = buildDrillDown
