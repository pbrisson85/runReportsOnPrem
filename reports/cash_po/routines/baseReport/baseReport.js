const m = require('./import')

const buildReport = async config => {
  const queryDataPromises = []
  const rowDataPromises = []

  ///////////////////////////////// PURCHASE DATA

  queryDataPromises.push(m.l0_getOpenPo(config))
  queryDataPromises.push(m.l1_getOpenPo(config))
  queryDataPromises.push(m.l2_getOpenPo(config))
  queryDataPromises.push(m.l3_getOpenPo(config))
  queryDataPromises.push(m.l4_getOpenPo(config))
  queryDataPromises.push(m.l5_getOpenPo(config))

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

  // make list of col dataNames that have been queried (note that certain flags will cause a col to not be queried)
  const colDataNames = new Set()
  data.forEach(row => {
    Object.keys(row).forEach(col => {
      colDataNames.add(col)
    })
  })

  const columns = await m.getColumns(config, colDataNames) // note that colDataNames are passed in to strip away any cols that are not needed however in this report for cashPo all cols are needed so thi is not used in the getColumns funciton

  return {
    data,
    cols: {
      labelCols: config.labelCols,
      ...columns,
    },
    baseConfig: config.baseConfig, // pass back for slice and detail reports
    defaultTrend: 'allPoCash', // col type of the trend col to show by default
  }
}

module.exports = buildReport
