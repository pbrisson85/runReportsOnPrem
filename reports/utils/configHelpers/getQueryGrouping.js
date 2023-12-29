const trendTypeOptions = require('../../filters/data/trendType')

const getQueryGrouping = reqArr => {
  if (typeof reqArr !== 'undefined') return reqArr[0]

  // get default
  const trendTypes = trendTypeOptions()
  const defaultType = trendTypes.filter(type => type.default)

  return defaultType[0].queryPeriod
}

module.exports = getQueryGrouping
