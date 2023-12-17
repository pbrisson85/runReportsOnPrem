const totalTypeOptions = () => {
  return [
    {
      // Checkbox
      label: 'Fiscal YTD',
      dataName: 'fyYtd',
      default: true,
      // Check Rules
      onTrueSetFalse: ['calYtd'],
      onFalseSetTrue: [],
      yearSelectionsAllowed: 2, // controls how many year selections can be made.
      // Custom Rules
      periodsMap: 'fiscal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      ytd: true, // bool for front end to not show the start trend dropdown
      // Custom Sync Rules
      trendDefault: 'fiscalWeeks', // dataName of the default trend when this is selected
      trendAllowed: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd'], // if the current trend dataName is not listed in the array then revert to trendDefault
    },
    {
      // Checkbox
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fyYtd'],
      onFalseSetTrue: [],
      yearSelectionsAllowed: 2, // controls how many year selections can be made.
      // Custom Rules
      periodsMap: 'cal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      ytd: true, // bool for front end to not show the start trend dropdown
      // Custom Sync Rules
      trendDefault: 'calMonths', // dataName of the default trend when this is selected
      trendAllowed: ['calMonths', 'calQuarters', 'calYtd'], // if the current trend dataName is not listed in the array then revert to trendDefault
    },
  ]
}

module.exports = totalTypeOptions
