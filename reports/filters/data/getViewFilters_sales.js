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
      label: 'REVENUE $',
      dataName: 'grossSales',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'OTHP $',
      dataName: 'othp',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'NET REVENUE',
      dataName: 'netSales',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'COST',
      dataName: 'cogs',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'GROSS MARGIN',
      dataName: 'grossMargin',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'GROSS MARGIN %',
      dataName: 'grossMarginPercent',
      decimals: 2,
      cols: [],
      default: false,
    },
    // {
    //   label: 'REVENUE $/LB',
    //   dataName: 'grossSalesPerLb',
    //   decimals: 2,
    //   cols: [],
    //   default: false,
    // },
    // {
    //   label: 'OTHP $/LB',
    //   dataName: 'othpPerLb',
    //   decimals: 2,
    //   cols: [],
    //   default: false,
    // },
    {
      label: 'NET REVENUE/LB',
      dataName: 'netSalesPerLb',
      decimals: 2,
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
    {
      label: 'GROSS MARGIN/LB',
      dataName: 'grossMarginPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
  ]
}

module.exports = getViewFilters
