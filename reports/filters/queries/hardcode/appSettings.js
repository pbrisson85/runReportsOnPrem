const appSettings = () => {
  return [
    {
      label: 'Shift Totals Labels',
      dataName: 'shiftTotals',
      default: false,
      onTrueSetToFalse: ['shiftTotalsCss'],
      subtotalOption: true,
    },
    {
      label: 'Shift Totals Labels and Css',
      dataName: 'shiftTotalsCss',
      default: false,
      onTrueSetToFalse: ['shiftTotals'],
      subtotalOption: true,
      shiftedSubtotals: true,
    },
    {
      label: 'Bypass Cache',
      dataName: 'bypassCache',
      default: false,
      onTrueSetToFalse: false,
    },
  ]
}

module.exports = appSettings
