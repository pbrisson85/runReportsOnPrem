// These filters are choose one only and it is passed to the back end.

const trendTypeOptions = () => {
  return [
    {
      label: 'Fiscal Weeks',
      dataName: 'fiscalWeeks',
      default: false,
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'weeks', // front end map to filter (appears as map in query)
    },
    {
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_periods', // front end map to filter (appears as map in query)
    },
    {
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
    },
    {
      label: 'FY YTD',
      dataName: 'fyYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_years', // front end map to filter (appears as map in query)
    },
    {
      label: 'FY Full Year',
      dataName: 'fyFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_years', // front end map to filter (appears as map in query)
    },
    {
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'cal_months', // front end map to filter (appears as map in query)
    },
    {
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calFullYear'],
      onFalseSetTrue: [],
      filterMap: 'cal_years', // front end map to filter (appears as map in query)
    },
    {
      label: 'Calendar Full Year',
      dataName: 'calFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calYtd'],
      onFalseSetTrue: [],
      filterMap: 'cal_years', // front end map to filter (appears as map in query)
    },
  ]
}

module.exports = trendTypeOptions
