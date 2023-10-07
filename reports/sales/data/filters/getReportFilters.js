// These filters are choose one only and it is passed to the back end.

const reportFilters = () => {
  return [
    {
      label: 'Show Non-Fg Totals',
      dataName: 'showNonFgTotals',
      default: false,
    },
    {
      label: 'Show FY Trend',
      dataName: 'showFyTrend',
      default: false,
    },
  ]
}

module.exports = reportFilters
