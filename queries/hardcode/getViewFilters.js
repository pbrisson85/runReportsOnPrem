const getViewFilters = () => {
  return [
    {
      label: 'WEIGHT (lbs)',
      dataName: 'weight',
      additionalData: { decimals: 0 },
    },
    // {
    //   label: 'REVENUE $',
    //   dataName: 'revenue',
    //   additionalData: { decimals: 0 },
    // },
    // {
    //   label: 'OTHP $',
    //   dataName: 'othp',
    //   additionalData: { decimals: 0 },
    // },
    {
      label: 'NET REVENUE $',
      dataName: 'netSales',
      additionalData: { decimals: 0 },
    },
    {
      label: 'COST $',
      dataName: 'cogs',
      additionalData: { decimals: 0 },
    },
    {
      label: 'GM $',
      dataName: 'grossMargin',
      additionalData: { decimals: 0 },
    },
    // {
    //   label: 'REVENUE $/LB',
    //   dataName: 'revenuePerLb',
    //   additionalData: { decimals: 2 },
    // },
    // {
    //   label: 'OTHP $/LB',
    //   dataName: 'othpPerLb',
    //   additionalData: { decimals: 2 },
    // },
    {
      label: 'NET REVENUE $/LB',
      dataName: 'netSalesPerLb',
      additionalData: { decimals: 2 },
    },
    {
      label: 'COST $/LB',
      dataName: 'cogsPerLb',
      additionalData: { decimals: 2 },
    },
    {
      label: 'GM $/LB',
      dataName: 'grossMarginPerLb',
      additionalData: { decimals: 2 },
    },
  ]
}

module.exports = getViewFilters
