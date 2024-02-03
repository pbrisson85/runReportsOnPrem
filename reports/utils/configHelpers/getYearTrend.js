const getYearTrend = reqBody => {
  if (typeof reqBody.trendOption?.[0]?.yoy === 'undefined') return null

  console.log('reqBody', reqBody)
  console.log('reqBody.trendStartPrimary', reqBody.trendStartPrimary)

  return {
    period_name: reqBody.trendOption[0].yoyPeriodField, // will have a start period and end period. period field name will be determined based on cal vs fiscal (month or week)
    start_period: parseInt(reqBody.trendStartPrimary?.period),
    end_period: parseInt(reqBody.trendEndPrimary?.period) === 52 ? 53 : parseInt(reqBody.trendEndPrimary?.period),
    years: typeof reqBody.trendYears === 'undefined' ? [] : reqBody.trendYears.map(yr => parseInt(yr)),
  }
}

module.exports = getYearTrend
