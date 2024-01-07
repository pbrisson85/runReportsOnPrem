const _ = require('lodash')

// adds identifying data to the sales total col so that any detail or trend requests have relevant date and flags
// also customize the displayname here based on parameters requested.

const addDataToProductionTotalCol = (config, columnConfigs, woActivityGroups) => {
  // Add startDate and endDate to the column configs so that it can be passed back in the detail and trend queries.

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

  const woTotalsCols = []
  for (let i = 0; i < woActivityGroups.length; i++) {
    const activity = woActivityGroups[i]
    const trendDefault = i === 0 ? true : false
    const displayName = `${startDisplayClean} - ${endDisplayClean} ${activity}`

    woTotalsCols.push({
      ...columnConfigs.woCols[0],
      trendDefault,
      displayName,
      dataName: activity,
      colType: `wo_${activity}`,
    })
  }

  columnConfigs.woCols = woTotalsCols

  return columnConfigs
}

module.exports = { addDataToProductionTotalCol }
