const appSettings = () => {
  return [
    {
      type: 'chkbox',
      label: 'Shift Totals Labels',
      dataName: 'shiftTotals',
      default: false,
      onTrueSetFalse: ['shiftTotalsCss'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      type: 'chkbox',
      label: 'Shift Totals Labels and Css',
      dataName: 'shiftTotalsCss',
      default: false,
      onTrueSetFalse: ['shiftTotals'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      type: 'chkbox',
      label: 'Data Label in Subtotals',
      dataName: 'dataLabelInSubtotals',
      default: true,
      onTrueSetFalse: false,
      onFalseSetTrue: ['subtotalLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      type: 'chkbox',
      label: 'Subtotal Label in Subtotals',
      dataName: 'subtotalLabelInSubtotals',
      default: false,
      onTrueSetFalse: false,
      onFalseSetTrue: ['dataLabelInSubtotals'], // cannot both be false but both can be true
    },
    {
      type: 'chkbox',
      label: 'Bypass Cache Everyone',
      dataName: 'bypassCacheEveryone',
      default: false,
      onTrueSetFalse: ['bypassCacheAdminOnly'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    {
      type: 'chkbox',
      label: 'Bypass Cache Admin Only',
      dataName: 'bypassCacheAdminOnly',
      default: true,
      onTrueSetFalse: ['bypassCacheEveryone'], // cannot both be true but both can be false
      onFalseSetTrue: false,
    },
    // {
    //   type: 'input',
    //   label: 'Cache Seconds',
    //   dataName: 'cacheSeconds',
    //   default: true,
    // },
  ]
}

module.exports = appSettings
