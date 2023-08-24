const getDistinctFiscalYears = require('../queries/postgres/getDistinctFiscalYears')
const { getDateEndPerWeek } = require('../queries/postgres/getDateEndPerWeek')

const getDefaults = async () => {
  const fys = await getDistinctFiscalYears()

  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })

  const periods = await getDateEndPerWeek(fys[0].label)
  const defaultStart = periods[0].displayname

  // By default set the end period to the previos week.

  // Look up current week
  const today = new Date()
  const todayWeek = periods.findIndex(period => {
    const periodEnd = new Date(period.displayname)
    return today <= periodEnd
  })

  let defaultEnd
  if (todayWeek === -1) {
    defaultEnd = periods[periods.length - 1].displayname
  } else if (todayWeek === 0) {
    defaultEnd = periods[0].displayname
  } else {
    defaultEnd = periods[todayWeek - 1].displayname
  }

  return { defaultStart, defaultEnd }
}

module.exports = getDefaults
