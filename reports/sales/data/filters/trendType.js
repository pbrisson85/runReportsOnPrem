// These filters are choose one only and it is passed to the back end.

const trendTypeOptions = () => {
  return [
    {
      label: 'Fiscal Weeks',
      dataName: 'fiscalWeeks',
      default: true,
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years', // determines what map to use for the years menu. (dont show years, show fiscal, show calendar)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    },
    {
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'period', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    },
    {
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'fiscal_quarter', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    },
    {
      label: 'FY YTD',
      dataName: 'fyYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'fiscal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      ytd: true, // bool for front end to not show the start trend dropdown
    },
    {
      label: 'FY Full Year',
      dataName: 'fyFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'fiscal_years', // front end map to filter (appears as map in query)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yearsMap: null,
    },
    {
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    },
    {
      label: 'Calendar Quarters',
      dataName: 'calQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calMonths'],
      onFalseSetTrue: [],
      periodsMap: 'cal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years', // front end map to years (appears as map in query)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    },
    {
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'cal_ytd', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      ytd: true, // bool for front end to not show the start trend dropdown
    },
    {
      label: 'Calendar Full Year',
      dataName: 'calFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calYtd', 'calQuarters'],
      onFalseSetTrue: [],
      periodsMap: 'cal_years', // front end map to filter (appears as map in query)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yearsMap: null,
    },
  ]
}

module.exports = trendTypeOptions
