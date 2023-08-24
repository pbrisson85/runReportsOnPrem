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
  ]
}

module.exports = reportFilters
