const m = require('./import')

const buildReport = async config => {
  const queryDataPromises = []
  const rowDataPromises = []

  ///////////////////////////////// CONFIG
  const woActivityGroups = await m.getWoActivityGroups(config)

  ///////////////////////////////// WORK ORDER DATA

  queryDataPromises.push(m.l0_getProduction(config, woActivityGroups))
  queryDataPromises.push(m.l1_getProduction(config, woActivityGroups))
  queryDataPromises.push(m.l2_getProduction(config, woActivityGroups))
  queryDataPromises.push(m.l3_getProduction(config, woActivityGroups))
  queryDataPromises.push(m.l4_getProduction(config, woActivityGroups))
  queryDataPromises.push(m.l5_getProduction(config, woActivityGroups))

  queryDataPromises.push(m.l0_getProductionTrend(config, woActivityGroups))
  queryDataPromises.push(m.l1_getProductionTrend(config, woActivityGroups))
  queryDataPromises.push(m.l2_getProductionTrend(config, woActivityGroups))
  queryDataPromises.push(m.l3_getProductionTrend(config, woActivityGroups))
  queryDataPromises.push(m.l4_getProductionTrend(config, woActivityGroups))
  queryDataPromises.push(m.l5_getProductionTrend(config, woActivityGroups))

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

  queryDataPromises.push(m.l0_getReceivedPo(config))
  queryDataPromises.push(m.l1_getReceivedPo(config))
  queryDataPromises.push(m.l2_getReceivedPo(config))
  queryDataPromises.push(m.l3_getReceivedPo(config))
  queryDataPromises.push(m.l4_getReceivedPo(config))
  queryDataPromises.push(m.l5_getReceivedPo(config))

  ///////////////////////////////// SALES ORDERS

  queryDataPromises.push(m.l0_getSo(config))
  queryDataPromises.push(m.l1_getSo(config))
  queryDataPromises.push(m.l2_getSo(config))
  queryDataPromises.push(m.l3_getSo(config))
  queryDataPromises.push(m.l4_getSo(config))
  queryDataPromises.push(m.l5_getSo(config))

  ///////////////////////////////// SALES
  queryDataPromises.push(m.l0_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l1_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l2_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l3_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l4_getSalesTotalPrimary(config))
  queryDataPromises.push(m.l5_getSalesTotalPrimary(config))

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
  const columns = await m.getColumns(config, woActivityGroups)

  return {
    data,
    cols: {
      labelCols: config.labelCols,
      ...columns,
    },
    baseConfig: config.baseConfig,
  }
}

module.exports = buildReport
