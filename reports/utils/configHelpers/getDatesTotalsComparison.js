const getDatesTotalsComparison = async reqBody => {
  console.log('reqBody.vsYears', reqBody.vsYears)

  if (typeof reqBody.vsYears === 'undefined' || reqBody.vsYears === null || reqBody.vsYears.length === 0) return null

  // get start period, end period, period name, comparison year
  return {
    period_name: reqBody.trendOption[0].yoyPeriodField, // will have a start period and end period. period field name will be determined based on cal vs fiscal (month or week)
    start_period: 1,
    end_period: parseInt(reqBody.trendEndPrimary?.period) === 52 ? 53 : parseInt(reqBody.trendEndPrimary?.period),
    years: reqBody.vsYears.map(yr => parseInt(yr)),
  }
}

module.exports = getDatesTotalsComparison
