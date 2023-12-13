// These filters are multi select and are handled on the front end.

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
