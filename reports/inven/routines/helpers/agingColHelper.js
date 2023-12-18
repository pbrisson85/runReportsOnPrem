const _ = require('lodash')
const { subMonths, startOfDay, addDays } = require('date-fns')

const buildAgingCols = (config, columnConfigs) => {
  const columnConfigsCache = _.cloneDeep(columnConfigs)

  if (!config.invenReportCols?.aging) return []
  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  let ageCols = []
  for (ageBucket of aging) {
    const startDate = subMonths(today, ageBucket.start)
    const endDate = addDays(subMonths(today, ageBucket.end), 1)

    ageCols.push({
      ...columnConfigs.ageCol[0],
      dataName: ageBucket.dataName,
      displayName: ageBucket.displayName,
      startDate,
      endDate,
    })
  }

  columnConfigsCache.ageCol = ageCols

  return columnConfigsCache
}

module.exports = {
  buildAgingCols,
}
