const _ = require('lodash')

// adds identifying data to the sales total col so that any detail or trend requests have relevant date and flags
// also customize the displayname here based on parameters requested.

const addDataToSalesTotalCol = (config, columnConfigs) => {
  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.
  columnConfigs.primarySalesTotalCol.forEach(col => {
    // format displayName
    const startDisplay = new Date(config.totals.primary.startDatePrimary).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const startDisplayArr = startDisplay.split(',')[0].split('/')
    const startDisplayClean = `${startDisplayArr[0]}/${startDisplayArr[1]}/${startDisplayArr[2]}`

    const endDisplay = new Date(config.totals.primary.endDatePrimary).toLocaleString('en-US', {
      timeZone: 'America/New_York',
    })
    const endDisplayArr = endDisplay.split(',')[0].split('/')
    const endDisplayClean = `${endDisplayArr[0]}/${endDisplayArr[1]}/${endDisplayArr[2]}`

    const displayName = `${startDisplayClean} - ${endDisplayClean} ${col.displayName_original}`

    col.startDate = config.totals.primary.startDatePrimary
    col.endDate = config.totals.primary.endDatePrimary
    col.displayName = displayName
    col.useProjection = config.totals.useProjection
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

    col.startDate = config.salesOrders.startDate
    col.endDate = config.salesOrders.endDate
    col.displayName = displayName
  })

  return columnConfigs
}

// const addDataToSalesTrendCol = (config, columnConfigs) => {
//   // On right click must know if passing back projection data or not. All flags will be placed into the trend cols and the totals cols

//   columnConfigs.trendCol.forEach(col => {
//     // format displayName
//     col.useProjection = config.trends.useProjection
//   })

//   return columnConfigs
// }

module.exports.addDataToSalesTotalCol = addDataToSalesTotalCol
module.exports.addDataToSoTotalCol = addDataToSoTotalCol
// module.exports.addDataToSalesTrendCol = addDataToSalesTrendCol
