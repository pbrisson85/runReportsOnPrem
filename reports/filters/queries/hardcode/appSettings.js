const appSettings = () => {
  return [
    {
      label: 'Shift Totals Labels',
      dataName: 'shiftTotals',
      default: false,
      onTrueSetToFalse: ['shiftTotalsCss'], // cannot both be true but both can be false
    },
    {
      label: 'Shift Totals Labels and Css',
      dataName: 'shiftTotalsCss',
      default: false,
      onTrueSetToFalse: ['shiftTotals'], // cannot both be true but both can be false
    },
    {
      label: 'Data Label in Subtotals',
      dataName: 'dataLabelInSubtotals',
      default: true,
      onTrueSetToFalse: false,
      onFalseSetTrue: ['subtotalLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      label: 'Subtotal Label in Subtotals',
      dataName: 'subtotalLabelInSubtotals',
      default: false,
      onTrueSetToFalse: false,
      onFalseSetTrue: ['dataLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      label: 'Bypass Cache Everyone',
      dataName: 'bypassCacheEveryone',
      default: false,
      onTrueSetToFalse: ['bypassCacheAdminOnly'], // cannot both be true but both can be false
    },
    {
      label: 'Bypass Cache Admin Only',
      dataName: 'bypassCacheAdminOnly',
      default: true,
      onTrueSetToFalse: ['bypassCacheEveryone'], // cannot both be true but both can be false
    },
  ]
}

module.exports = appSettings
