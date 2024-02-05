const _ = require('lodash')
const { subMonths, startOfDay, addDays } = require('date-fns')

const buildAgingCols = (config, columnConfigs) => {
  const columnConfigsCache = _.cloneDeep(columnConfigs)

  if (!config.baseFilters.inv?.aging) return []
  const aging = config.baseFilters.inv.aging
  const today = startOfDay(new Date())

  let ageCols = []
  for (ageBucket of aging) {
    const start = addDays(subMonths(today, ageBucket.start), 1)
    const end = subMonths(today, ageBucket.end)

    ageCols.push({
      ...columnConfigs.ageCol[0],
      dataName: ageBucket.dataName,
      displayName: ageBucket.displayName,
      colStartDate: start,
      colEndDate: end,
    })
  }

  columnConfigsCache.ageCol = ageCols

  return columnConfigsCache
}

module.exports = {
  buildAgingCols,
}
