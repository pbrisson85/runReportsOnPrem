const totalTypeOptions = () => {
  return [
    {
      label: 'Fiscal YTD',
      dataName: 'fyYtd',
      default: true,
      onTrueSetFalse: ['calYtd', 'fyProjection'],
      onFalseSetTrue: [],
      periodsMap: 'fiscal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      ytd: true, // bool for front end to not show the start trend dropdown
      yearSelectionsAllowed: 2, // controls how many year selections can be made.
    },
    {
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      onTrueSetFalse: ['fyYtd', 'fyProjection'],
      onFalseSetTrue: [],
      periodsMap: 'cal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      ytd: true, // bool for front end to not show the start trend dropdown
      yearSelectionsAllowed: 2, // controls how many year selections can be made.
    },
  ]
}

module.exports = totalTypeOptions
