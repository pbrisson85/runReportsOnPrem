const getYearTrend = reqBody => {
  if (typeof reqBody.trendOption?.[0]?.ytd === 'undefined') return null

  return {
    period_name: reqBody.trendOption[0].ytdPeriodField, // will have a start period and end period. period field name will be determined based on cal vs fiscal (month or week)
    start_period: parseInt(reqBody.trendStartPrimary?.period),
    end_period: parseInt(reqBody.trendEndPrimary?.period) === 52 ? 53 : parseInt(reqBody.trendEndPrimary?.period),
    years: typeof reqBody.trendYears === 'undefined' ? [] : reqBody.trendYears.map(yr => parseInt(yr)),
  }
}

module.exports = getYearTrend
