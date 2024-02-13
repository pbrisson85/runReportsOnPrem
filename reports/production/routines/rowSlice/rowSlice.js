const m = require('./import')

const buildDrillDown = async (labelCols, config, trendQuery) => {
  const queryDataPromises = []
  const rowDataPromises = []

  ///////////////////////////////// WORK ORDER DATA

  queryDataPromises.push(m.l0_getProduction(config))
  queryDataPromises.push(m.l1_getProduction(config, trendQuery))

  queryDataPromises.push(m.l0_getProductionTrend(config))
  queryDataPromises.push(m.l1_getProductionTrend(config, trendQuery))

  ///////////////////////////////// INVENTORY DATA

  queryDataPromises.push(m.l0_getInv(config))
  queryDataPromises.push(m.l1_getInv(config, trendQuery))

  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l0_getOpenPo(config))
  queryDataPromises.push(m.l1_getOpenPo(config, trendQuery))

  ///////////////////////////////// SALES ORDERS

  queryDataPromises.push(m.l0_getSo(config))
  queryDataPromises.push(m.l1_getSo(config, trendQuery))

  ///////////////////////////////// SALES
  queryDataPromises.push(m.l0_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l1_getSalesTotalPrimary(config, trendQuery))

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

  /* BUILD ROW MAP */

  const rowTemplate = m.sortRowTemplate(rowData)
  const key = { 1: 'l1_label' }
  const rowTemplate_unflat = m.unflattenByCompositKey(rowTemplate, key)

  /* MAP DATA TO ROWS */

  const mappedData = m.mapDataToRowTemplates(queryData, rowTemplate_unflat, config, (viewTrend = true))
  const data = Object.values(mappedData)
  // const data = m.cleanLabelsForDisplay(flattenedMappedData, config)

  /* COLUMNS */
  const columns = await m.getColumns(config)

  return {
    data,
    cols: {
      labelCols,
      ...columns,
    },
    defaultTrend: 'salesInvoice', // col type of the trend col to show by default
  }
}

module.exports = buildDrillDown
