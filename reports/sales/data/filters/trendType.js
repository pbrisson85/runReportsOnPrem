// These filters are choose one only and it is passed to the back end.

const trendTypeOptions = () => {
  return [
    {
      label: 'Fiscal Weeks',
      dataName: 'fiscalWeeks',
      default: false,
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years', // determines what map to use for the years menu. (dont show years, show fiscal, show calendar)
    },
    {
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
    },
    {
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
    },
    {
      label: 'FY YTD',
      dataName: 'fyYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
    },
    {
      label: 'FY Full Year',
      dataName: 'fyFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'fiscal_years', // front end map to filter (appears as map in query)
      yearsMap: null,
    },
    {
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
    },
    {
      label: 'Calendar Quarters',
      dataName: 'calQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calMonths'],
      onFalseSetTrue: [],
      filterMap: 'cal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years', // front end map to years (appears as map in query)
    },
    {
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'cal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
    },
    {
      label: 'Calendar Full Year',
      dataName: 'calFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calYtd', 'calQuarters'],
      onFalseSetTrue: [],
      filterMap: 'cal_years', // front end map to filter (appears as map in query)
      yearsMap: null,
    },
  ]
}

module.exports = trendTypeOptions
