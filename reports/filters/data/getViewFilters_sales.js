const getViewFilters = () => {
  return [
    {
      label: 'WEIGHT (lbs)',
      dataName: 'lbs',
      decimals: 0,
      cols: [], // list of colTypes that are NOT shown in this view
    },
    {
      label: 'REVENUE $',
      dataName: 'grossSales',
      decimals: 0,
      cols: [],
    },
    {
      label: 'OTHP $',
      dataName: 'othp',
      decimals: 0,
      cols: [],
    },
    {
      label: 'NET REVENUE',
      dataName: 'netSales',
      decimals: 0,
      cols: [],
    },
    {
      label: 'COST',
      dataName: 'cogs',
      decimals: 0,
      cols: [],
    },
    {
      label: 'GROSS MARGIN',
      dataName: 'grossMargin',
      decimals: 0,
      cols: [],
    },
    {
      label: 'GROSS MARGIN %',
      dataName: 'grossMarginPercent',
      decimals: 2,
      cols: [],
    },
    // {
    //   label: 'REVENUE $/LB',
    //   dataName: 'grossSalesPerLb',
    //   decimals: 2,
    //   cols: [],
    // },
    // {
    //   label: 'OTHP $/LB',
    //   dataName: 'othpPerLb',
    //   decimals: 2,
    //   cols: [],
    // },
    {
      label: 'NET REVENUE/LB',
      dataName: 'netSalesPerLb',
      decimals: 2,
      cols: [],
    },
    {
      label: 'COST/LB',
      dataName: 'cogsPerLb',
      decimals: 2,
      cols: [],
    },
    {
      label: 'GROSS MARGIN/LB',
      dataName: 'grossMarginPerLb',
      decimals: 2,
      cols: [],
    },
  ]
}

module.exports = getViewFilters
