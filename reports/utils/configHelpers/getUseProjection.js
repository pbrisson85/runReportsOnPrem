const getProjectionOptions = require('../../filters/data/useProjections')

const getUseProjection = reqUseProjection => {
  const projectionOptions = getProjectionOptions()

  let useProjection
  if (typeof reqUseProjection === 'undefined') {
    // use Defaults
    useProjection = {
      sl: projectionOptions.filter(option => option.configKey === 'sl')[0].default ?? false,
      so: projectionOptions.filter(option => option.configKey === 'so')[0].default ?? false,
      pr: projectionOptions.filter(option => option.configKey === 'pr')[0].default ?? false,
    }
  } else {
    // use front end options
    useProjection = {
      sl: reqUseProjection.includes('sales'),
      so: reqUseProjection.includes('salesOrders'),
      pr: reqUseProjection.includes('useRecurringProjection'),
    }
  }

  return useProjection
}

module.exports = getUseProjection
