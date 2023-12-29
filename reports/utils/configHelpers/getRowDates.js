const getDatesTotalsPrimary = require('./getDatesTotalsPrimary')
const getDatesTotalsComparison = require('./getDatesTotalsComparison')
const getTrendDates = require('./getTrendDates')
const { getEarliestSoShipDate, getLatestSoShipDate } = require('./getSoDates')

const getRowDates = async reqBody => {
  // Need the earliest and latest of trend, so, or totals dates for all applicable report rows

  const trendDates = await getTrendDates(reqBody)
  const totalsPrimaryDates = await getDatesTotalsPrimary(reqBody)
  const totalsComparisonDates = await getDatesTotalsComparison(reqBody)
  const earliestSoShipDate = await getEarliestSoShipDate(reqBody.user)
  const latestSoShipDate = await getLatestSoShipDate(reqBody.user)

  const eachStartDateArr = [trendDates.startDate, totalsPrimaryDates.startDate, totalsComparisonDates.startDate, earliestSoShipDate]
  const startDate = findEarliestDate(eachStartDateArr)

  const eachEndDateArr = [trendDates.endDate, totalsPrimaryDates.endDate, totalsComparisonDates.endDate, latestSoShipDate]
  const endDate = findLatestDate(eachEndDateArr)

  console.log('getRowDates: ', startDate, endDate)

  return {
    startDate,
    endDate,
  }
}

module.exports = getRowDates

const findEarliestDate = eachDateArr => {
  const earliestDate = eachDateArr.reduce((a, b) => (new Date(a).getTime() < new Date(b).getTime() ? a : b))
  return new Date(earliestDate)
}

const findLatestDate = eachDateArr => {
  const latestDate = eachDateArr.reduce((a, b) => (new Date(a).getTime() > new Date(b).getTime() ? a : b))
  return new Date(latestDate)
}
