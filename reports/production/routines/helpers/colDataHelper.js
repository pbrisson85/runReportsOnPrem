const _ = require('lodash')

// adds identifying data to the sales total col so that any detail or trend requests have relevant date and flags
// also customize the displayname here based on parameters requested.

const addDataToProductionTotalCol = (config, columnConfigs) => {
  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.
  columnConfigs.primarySalesTotalCol.forEach(col => {
    // format displayName
    const startDisplay = new Date(config.totals.primary.startDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const startDisplayArr = startDisplay.split(',')[0].split('/')
    const startDisplayClean = `${startDisplayArr[0]}/${startDisplayArr[1]}/${startDisplayArr[2]}`

    const endDisplay = new Date(config.totals.primary.endDate).toLocaleString('en-US', {
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
  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.
  columnConfigs.salesOrdersCol.forEach(col => {
    // format displayName
    const startDisplay = new Date(config.salesOrders.startDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const startDisplayArr = startDisplay.split(',')[0].split('/')
    const startDisplayClean = `${startDisplayArr[0]}/${startDisplayArr[1]}/${startDisplayArr[2]}`

    const endDisplay = new Date(config.salesOrders.endDate).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const endDisplayArr = endDisplay.split(',')[0].split('/')
    const endDisplayClean = `${endDisplayArr[0]}/${endDisplayArr[1]}/${endDisplayArr[2]}`

    const displayName = `${startDisplayClean} - ${endDisplayClean} ${col.displayName_original}`

    col.displayName = displayName
  })

  return columnConfigs
}

module.exports.addDataToSalesTotalCol = addDataToSalesTotalCol
module.exports.addDataToSoTotalCol = addDataToSoTotalCol
