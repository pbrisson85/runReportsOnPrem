const _ = require('lodash')
const { subMonths, startOfDay, addDays } = require('date-fns')

const buildAgingCols = (config, columnConfigs) => {
  const columnConfigsCache = _.cloneDeep(columnConfigs)

  if (!config.invenReportCols?.aging) return []
  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  let ageCols = []
  for (ageBucket of aging) {
    const start = addDays(subMonths(today, ageBucket.start), 1)
    const end = subMonths(today, ageBucket.end)

    ageCols.push({
      ...columnConfigs.ageCol[0],
      dataName: ageBucket.dataName,
      displayName: ageBucket.displayName,
      startDateInven: start,
      endDateInven: end,
    })
  }

  columnConfigsCache.ageCol = ageCols

  return columnConfigsCache
}

module.exports = {
  buildAgingCols,
}
