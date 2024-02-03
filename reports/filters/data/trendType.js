// These filters are choose one only and it is passed to the back end.

const trendTypeOptions = () => {
  return [
    {
      // Checkbox
      label: 'Fiscal Weeks',
      dataName: 'fiscalWeeks',
      default: true,
      // Check Rules
      trueOnNoSelection: true, // flags if this turns true when the selections are blank. Typically would mirror default flag if selection required
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'fiscalYears', 'calMonths', 'calYears', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years', // determines what map to use for the years menu. (dont show years, show fiscal, show calendar)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.week_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'fiscalYears', 'calMonths', 'calYears', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'period', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.period_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalYears', 'calMonths', 'calYears', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'fiscal_quarter', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.quarter_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Years (by week)',
      dataName: 'fiscalYears',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'calMonths', 'calYears', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years_multi',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.fiscal_year', // field for query used in trend group by
      yoyPeriodField: 'p.week',
    },
    {
      // Checkbox
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalYears', 'fiscalQuarters', 'calYears', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.cal_month_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Calendar Quarters',
      dataName: 'calQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalYears', 'fiscalQuarters', 'calYears', 'calMonths'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years', // front end map to years (appears as map in query)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.cal_quarter_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Calendar Years',
      dataName: 'calYears',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalYears', 'fiscalQuarters', 'calMonths', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years_multi',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.cal_year', // field for query used in trend group by
      yoyPeriodField: 'p.cal_month',
    },
  ]
}

module.exports = trendTypeOptions
