const appSettings = () => {
  return [
    {
      label: 'Shift Totals Labels',
      dataName: 'shiftTotals',
      default: false,
      onTrueSetFalse: ['shiftTotalsCss'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      label: 'Shift Totals Labels and Css',
      dataName: 'shiftTotalsCss',
      default: false,
      onTrueSetFalse: ['shiftTotals'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      label: 'Data Label in Subtotals',
      dataName: 'dataLabelInSubtotals',
      default: true,
      onTrueSetFalse: false,
      onFalseSetTrue: ['subtotalLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      label: 'Subtotal Label in Subtotals',
      dataName: 'subtotalLabelInSubtotals',
      default: false,
      onTrueSetFalse: false,
      onFalseSetTrue: ['dataLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      label: 'Bypass Cache Everyone',
      dataName: 'bypassCacheEveryone',
      default: false,
      onTrueSetFalse: ['bypassCacheAdminOnly'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      label: 'Bypass Cache Admin Only',
      dataName: 'bypassCacheAdminOnly',
      default: true,
      onTrueSetFalse: ['bypassCacheEveryone'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
  ]
}

module.exports = appSettings
