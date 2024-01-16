const getWoActivityGroups = require('../../filters/postgres/getWoActivityGroups')

const getWoActivities = async reqBody => {
  if (typeof reqBody?.productionActivities !== 'undefined') return reqBody.productionActivities

  // filter for default:
  const woActivityGroups = await getWoActivityGroups()
  const defaultVals = woActivityGroups.filter(g => g.default).map(g => g.dataName)
  return defaultVals
}

module.exports = getWoActivities
