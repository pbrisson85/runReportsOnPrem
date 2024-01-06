const getViewFilters = () => {
  return [
    {
      label: 'WEIGHT (lbs)',
      dataName: 'lbs',
      decimals: 0,
      cols: [], // list of colTypes that are NOT shown in this view
      default: true,
    },
    {
      label: 'COST',
      dataName: 'cogs',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'COST/LB',
      dataName: 'cogsPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
  ]
}

module.exports = getViewFilters
