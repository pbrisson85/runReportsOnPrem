const m = require('./import')

const buildReport = async config => {
  const queryDataPromises = []
  const rowDataPromises = []

  ///////////////////////////////// INVENTORY DATA

  queryDataPromises.push(m.l0_getInv(config))
  queryDataPromises.push(m.l1_getInv(config))
  queryDataPromises.push(m.l2_getInv(config))
  queryDataPromises.push(m.l3_getInv(config))
  queryDataPromises.push(m.l4_getInv(config))
  queryDataPromises.push(m.l5_getInv(config))

  queryDataPromises.push(m.l0_getInvAged(config))
  queryDataPromises.push(m.l1_getInvAged(config))
  queryDataPromises.push(m.l2_getInvAged(config))
  queryDataPromises.push(m.l3_getInvAged(config))
  queryDataPromises.push(m.l4_getInvAged(config))
  queryDataPromises.push(m.l5_getInvAged(config))

  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l0_getOpenPo(config))
  queryDataPromises.push(m.l1_getOpenPo(config))
  queryDataPromises.push(m.l2_getOpenPo(config))
  queryDataPromises.push(m.l3_getOpenPo(config))
  queryDataPromises.push(m.l4_getOpenPo(config))
  queryDataPromises.push(m.l5_getOpenPo(config))

  ///////////////////////////////// SALES ORDERS

  queryDataPromises.push(m.l0_getSo(config))
  queryDataPromises.push(m.l1_getSo(config))
  queryDataPromises.push(m.l2_getSo(config))
  queryDataPromises.push(m.l3_getSo(config))
  queryDataPromises.push(m.l4_getSo(config))
  queryDataPromises.push(m.l5_getSo(config))

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

  // Add data to hardcoded columns
  const columnConfigs = m.buildAgingCols(config, m.columnConfigs)

  return {
    data,
    cols: {
      labelCols: config.labelCols,
      columnConfigs,
    },
    baseConfig: config.baseConfig,
  }
}

module.exports = buildReport
