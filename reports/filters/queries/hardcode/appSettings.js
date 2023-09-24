const appSettings = () => {
  return [
    {
      label: 'Shift Totals Labels',
      dataName: 'shiftTotals',
      default: false,
      onTrueSetToFalse: ['shiftTotalsCss'],
    },
    {
      label: 'Shift Totals Labels and Css',
      dataName: 'shiftTotalsCss',
      default: false,
      onTrueSetToFalse: ['shiftTotals'],
    },
    {
      label: 'Bypass Cache Everyone',
      dataName: 'bypassCacheEveryone',
      default: false,
      onTrueSetToFalse: ['bypassCacheAdminOnly'],
    },
    {
      label: 'Bypass Cache Admin Only',
      dataName: 'bypassCacheAdminOnly',
      default: true,
      onTrueSetToFalse: ['bypassCacheEveryone'],
    },
  ]
}

module.exports = appSettings
