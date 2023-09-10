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

  const defaultYear = fys[0].label
  const periods = await getDateEndPerWeek(defaultYear)
  const defaultStart = periods[0].displayname

  // By default set the end period to the previos week.

  // Look up current week
  const today = new Date()
  // get index of the previous saturday (or today if today is saturday)
  const todayWeek = periods.findIndex(period => {
    const periodEnd = new Date(period.displayname)

    // within the array of each week ending date (saturdays) find the index of the first date that is greater than or equal to today (will always return the previous saturday)
    return today <= periodEnd
  })

  let defaultEnd
  if (todayWeek === -1) {
    // if no index found (such as running for a prior year) then return the last week of the year
    defaultEnd = periods[periods.length - 1].displayname
  } else if (todayWeek === 0) {
    // if it is the first week of the year then return the first week of the year
    defaultEnd = periods[0].displayname
  } else {
    // in all anticipated cases we want the previous week from today
    // change logic: if today is saturday, sunday, monday, tuesday then return two weeks ago. Otherwise return last week

    if ((today.getDay() === 6 || today.getDay() === 0 || today.getDay() === 1 || today.getDay() === 2) && todayWeek > 1) {
      defaultEnd = periods[todayWeek - 2].displayname
    } else {
      defaultEnd = periods[todayWeek - 1].displayname
    }
  }

  return { defaultStart, defaultEnd, defaultYear }
}

module.exports = getDefaults
