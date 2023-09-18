const reportFilters = () => {
  return [
    {
      label: 'None',
      dataName: 'none',
      default: true,
    },
    {
      label: 'JB Buyer',
      dataName: 'jbBuyer',
      default: false,
    },
    {
      label: 'Hide By Product and Seconds',
      dataName: 'hideNonFg',
      default: true,
    },
  ]
}

module.exports = reportFilters
