const getViewFilters = () => {
  return [
    {
      label: 'WEIGHT (lbs)',
      dataName: 'lbs',
      additionalData: { decimals: 0 },
      cols: [
        'label',
        'salesInvoice',
        'salesInvoiceMo',
        'salesOrder',
        'invenTotal',
        'invenRm',
        'purchaseOrder',
        'salesKpi',
        'invenKpi',
        'salesProjection',
        'ageCols',
      ], // list of colTypes that should be displayed in this view
    },
    {
      label: 'REVENUE $',
      dataName: 'grossSales',
      additionalData: { decimals: 0 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection', 'ageCols'], // No inven, only sales data
    },
    {
      label: 'OTHP $',
      dataName: 'othp',
      additionalData: { decimals: 0 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    },
    {
      label: 'NET REVENUE',
      dataName: 'netSales',
      additionalData: { decimals: 0 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    },
    {
      label: 'COST',
      dataName: 'cogs',
      additionalData: { decimals: 0 },
      cols: [
        'label',
        'salesInvoice',
        'salesInvoiceMo',
        'salesOrder',
        'invenTotal',
        'invenRm',
        'purchaseOrder',
        'salesKpi',
        'invenKpi',
        'salesProjection',
        'ageCols',
      ],
    },
    {
      label: 'GROSS MARGIN',
      dataName: 'grossMargin',
      additionalData: { decimals: 0 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    },
    {
      label: 'GROSS MARGIN %',
      dataName: 'grossMarginPercent',
      additionalData: { decimals: 0 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    },
    // {
    //   label: 'REVENUE $/LB',
    //   dataName: 'grossSalesPerLb',
    //   additionalData: { decimals: 2 },
    //   cols: ['label',  'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    // },
    // {
    //   label: 'OTHP $/LB',
    //   dataName: 'othpPerLb',
    //   additionalData: { decimals: 2 },
    //   cols: ['label',  'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    // },
    {
      label: 'NET REVENUE/LB',
      dataName: 'netSalesPerLb',
      additionalData: { decimals: 2 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection', 'invenTotal', 'purchaseOrder'], // No inven, only sales data
    },
    {
      label: 'COST/LB',
      dataName: 'cogsPerLb',
      additionalData: { decimals: 2 },
      cols: [
        'label',
        'salesInvoice',
        'salesInvoiceMo',
        'salesOrder',
        'invenTotal',
        'invenRm',
        'purchaseOrder',
        'salesKpi',
        'invenKpi',
        'salesProjection',
        'ageCols',
      ],
    },
    {
      label: 'GROSS MARGIN/LB',
      dataName: 'grossMarginPerLb',
      additionalData: { decimals: 2 },
      cols: ['label', 'salesInvoice', 'salesInvoiceMo', 'salesOrder', 'salesKpi', 'salesProjection'], // No inven, only sales data
    },
  ]
}

module.exports = getViewFilters
