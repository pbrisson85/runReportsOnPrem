const _ = require('lodash')

// adds identifying data to the sales total col so that any detail or trend requests have relevant date and flags
// also customize the displayname here based on parameters requested.

const addDataToSalesTotalCol = (config, columnConfigs) => {
  if (!columnConfigs?.primarySalesTotalCol) return columnConfigs

  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.
  columnConfigs.primarySalesTotalCol.forEach(col => {
    // format displayName
    const startDisplay = new Date(config.dates.totals.primary.startDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const startDisplayArr = startDisplay.split(',')[0].split('/')
    const startDisplayClean = `${startDisplayArr[0]}/${startDisplayArr[1]}/${startDisplayArr[2]}`

    const endDisplay = new Date(config.dates.totals.primary.endDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const endDisplayArr = endDisplay.split(',')[0].split('/')
    const endDisplayClean = `${endDisplayArr[0]}/${endDisplayArr[1]}/${endDisplayArr[2]}`

    const displayName = `${startDisplayClean} - ${endDisplayClean} ${col.displayName_original}`

    col.displayName = displayName
  })

  return columnConfigs
}

const addDataToSoTotalCol = (config, columnConfigs) => {
  if (!columnConfigs?.salesOrdersCol) return columnConfigs

  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.
  columnConfigs.salesOrdersCol.forEach(col => {
    // format displayName
    const startDisplay = new Date(config.dates.salesOrders.startDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const startDisplayArr = startDisplay.split(',')[0].split('/')
    const startDisplayClean = `${startDisplayArr[0]}/${startDisplayArr[1]}/${startDisplayArr[2]}`

    const endDisplay = new Date(config.dates.salesOrders.endDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const endDisplayArr = endDisplay.split(',')[0].split('/')
    const endDisplayClean = `${endDisplayArr[0]}/${endDisplayArr[1]}/${endDisplayArr[2]}`

    const displayName = `${startDisplayClean} - ${endDisplayClean} ${col.displayName_original}`

    col.displayName = displayName
  })

  return columnConfigs
}

const removeColsWithNoData = (columnConfigs, colDataNames) => {
  const columnConfigsCopy = _.cloneDeep(columnConfigs)

  Object.keys(columnConfigsCopy).forEach(key => {
    columnConfigsCopy[key] = columnConfigsCopy[key].filter(col => {
      // if coDataNames set includes the col.dataName, keep it
      return colDataNames.has(col.dataName)
    })
  })

  return columnConfigsCopy
}

module.exports = { removeColsWithNoData, addDataToSalesTotalCol, addDataToSoTotalCol }
