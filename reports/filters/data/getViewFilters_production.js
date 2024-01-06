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
      label: 'YIELD',
      dataName: 'yield',
      decimals: 1,
      cols: [],
      default: true,
    },
    {
      label: 'COST',
      dataName: 'cost',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'LABOR',
      dataName: 'labor',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'OH',
      dataName: 'oh',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'PACKAGING',
      dataName: 'packaging',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'CHEMICAL',
      dataName: 'chem',
      decimals: 0,
      cols: [],
      default: false,
    },
    {
      label: 'PROCESSING FEE',
      dataName: 'processingFee',
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
    {
      label: 'LABOR/LB',
      dataName: 'laborPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
    {
      label: 'LABOR/LB',
      dataName: 'laborPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
    {
      label: 'OH/LB',
      dataName: 'ohPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
    {
      label: 'PACKAGING/LB',
      dataName: 'packagingPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
    {
      label: 'CHEMICAL/LB',
      dataName: 'chemPerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
    {
      label: 'PROCESSING FEE/LB',
      dataName: 'processingFeePerLb',
      decimals: 2,
      cols: [],
      default: false,
    },
  ]
}

module.exports = getViewFilters
