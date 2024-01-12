const trendTypeOptions = require('../../filters/data/trendType')

const getQueryGrouping = reqBody => {
  if (typeof reqBody.trendOption?.[0]?.groupByPeriod !== 'undefined') return reqBody.trendOption?.[0]?.groupByPeriod

  // get default
  const trendTypes = trendTypeOptions()
  const defaultType = trendTypes.filter(type => type.default)

  return defaultType[0].groupByPeriod
}

module.exports = getQueryGrouping
