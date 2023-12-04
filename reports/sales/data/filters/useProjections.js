const projectionOptions = () => {
  return [
    {
      label: 'All',
      dataName: 'all',
      default: false,
      onTrueSetFalse: ['sales', 'salesOrders', 'useRecurringProjection', 'useNonRecurringProjection'],
      onFalseSetTrue: [],
    },
    {
      label: 'Sales',
      dataName: 'sales',
      default: true,
      onTrueSetFalse: [],
      onFalseSetTrue: [],
    },
    {
      label: 'Sales Orders',
      dataName: 'salesOrders',
      default: false,
      onTrueSetFalse: [],
      onFalseSetTrue: [],
    },
    {
      label: 'Recurring Projection',
      dataName: 'useRecurringProjection',
      default: false,
      onTrueSetFalse: [],
      onFalseSetTrue: [],
    },
    {
      label: 'Non Recurring Projection',
      dataName: 'useNonRecurringProjection',
      default: false,
      onTrueSetFalse: [],
      onFalseSetTrue: [],
    },
  ]
}

module.exports = projectionOptions
