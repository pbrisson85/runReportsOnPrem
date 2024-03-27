const getClosestWeekStartDate = require('./getClosestWeekStartDate')
const getClosestWeekEndDate = require('./getClosestWeekEndDate')
const { getPoCashStart, getPoCashEnd } = require('./getPoCashStartAndEnd')

const getPoCashDates = async () => {
  // Defaults

  const todayStartOfWeek = await getClosestWeekStartDate(new Date(), 'po cash dates')

  const cashStartDate = await getPoCashStart()
  const cashStartOfWeek = await getClosestWeekStartDate(cashStartDate, 'po cash dates')

  const cashEndDate = await getPoCashEnd()
  const cashEndOfWeek = await getClosestWeekEndDate(cashEndDate, 'po cash dates')

  // use earlier of today's start of week or cash start of week
  const startDate = todayStartOfWeek < cashStartOfWeek ? todayStartOfWeek : cashStartOfWeek

  return { startDate, endDate: cashEndOfWeek }
}

module.exports = getPoCashDates
