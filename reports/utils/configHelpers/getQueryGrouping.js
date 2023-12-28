const trendTypeOptions = require('../../filters/data/trendType')

const getQueryGrouping = reqArr => {
  if (typeof reqArr !== 'undefined') return reqBody.trendQueryGrouping[0]

  // get default
  const trendTypes = trendTypeOptions()
  const defaultType = trendTypes.filter(type => type.default)

  return defaultType[0].dataName
}

module.exports = getQueryGrouping
