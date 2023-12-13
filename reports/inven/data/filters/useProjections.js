const projectionOptions = () => {
  return [
    {
      label: 'All',
      dataName: 'all',
      default: false,
      trueOnNoSelection: false, // flags if this turns true when the selections are blank. Typically would mirror default flag if selection required
      ignoreInSelections: true, // rules will be applied but this box will never turn true
      onTrueSetTrue: ['sales', 'salesOrders', 'useRecurringProjection', 'useNonRecurringProjection'],
      onTrueSetFalse: [],
      onFalseSetTrue: [], // note that cant have an onFalse rule because of the ignoreInSelections rule. Can never be true
      maxSelections: false, // limits the number of selections and sets all false if exceeded
    },
    {
      label: 'Sales',
      dataName: 'sales',
      default: true,
      trueOnNoSelection: true,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: false,
      configKey: 'sl', // maps to the config option key
    },
    {
      label: 'Sales Orders',
      dataName: 'salesOrders',
      default: true,
      trueOnNoSelection: false,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: false,
      configKey: 'so', // maps to the config option key
    },
    {
      label: 'Recurring Projection',
      dataName: 'useRecurringProjection',
      default: false,
      trueOnNoSelection: false,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: false,
      configKey: 'pr', // maps to the config option key
    },
    {
      label: 'Non Recurring Projection',
      dataName: 'useNonRecurringProjection',
      default: false,
      trueOnNoSelection: false,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: false,
      configKey: 'pn', // maps to the config option key
    },
  ]
}

module.exports = projectionOptions
