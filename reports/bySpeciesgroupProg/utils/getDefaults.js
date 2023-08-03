const getDistinctFiscalYears = require('../../shared/queries/postgres/getDistinctFiscalYears')
const { getDateEndPerWeek } = require('../../shared/queries/postgres/getDateEndPerWeek')

const getDefaults = async () => {
  const fys = await getDistinctFiscalYears()

  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })

  const periods = await getDateEndPerWeek(fys[0].label)
  const start = periods[0].displayname

  // By default set the end period to the previos week.
  console.log('periods', periods)

  // Look up current week
  const today = new Date()
  const todayWeek = periods.findIndex(period => {
    const periodEnd = new Date(period.displayname)
    return today <= periodEnd
  })

  let end
  if (todayWeek === -1) {
    end = periods[periods.length - 1].displayname
  } else if (todayWeek === 0) {
    end = periods[0].displayname
  } else {
    end = periods[todayWeek - 1].displayname
  }

  return { start, end }
}

module.exports = getDefaults
