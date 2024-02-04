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
      onTrueSetFalse: [
        'fiscalPeriods',
        'fiscalQuarters',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'calMonths',
        'calYears',
        'calQuarters',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years', // determines what map to use for the years menu. (dont show years, show fiscal, show calendar)
      yearsMapVs: 'fiscal_years_vs', // years for the vs column (no default, inactive for yoy trends)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.week_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalQuarters',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'calMonths',
        'calYears',
        'calQuarters',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      yearsMapVs: 'fiscal_years_vs',
      currentDateMap: 'period', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.period_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'calMonths',
        'calYears',
        'calQuarters',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      yearsMapVs: 'fiscal_years_vs',
      currentDateMap: 'fiscal_quarter', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.quarter_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Fiscal Years (by wk)',
      dataName: 'fiscalYears_wk',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalQuarters',
        'calMonths',
        'calYears',
        'calQuarters',
        'fiscalYears_per',
        'fiscalYears_qtr',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years_multi',
      yearsMapVs: 'fiscal_years_inactive',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.fiscal_year', // field for query used in trend group by
      yoyPeriodField: 'p.week',
    },
    {
      // Checkbox
      label: 'Fiscal Years (by per)',
      dataName: 'fiscalYears_per',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalQuarters',
        'calMonths',
        'calYears',
        'calQuarters',
        'fiscalYears_wk',
        'fiscalYears_qtr',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years_multi',
      yearsMapVs: 'fiscal_years_inactive',
      currentDateMap: 'period', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.fiscal_year', // field for query used in trend group by
      yoyPeriodField: 'p.period',
    },
    {
      // Checkbox
      label: 'Fiscal Years (by qtr)',
      dataName: 'fiscalYears_qtr',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalQuarters',
        'calMonths',
        'calYears',
        'calQuarters',
        'fiscalYears_wk',
        'fiscalYears_per',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years_multi',
      yearsMapVs: 'fiscal_years_inactive',
      currentDateMap: 'fiscal_quarter', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.fiscal_year', // field for query used in trend group by
      yoyPeriodField: 'p.fiscal_quarter',
    },
    {
      // Checkbox
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'fiscalQuarters',
        'calYears',
        'calQuarters',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      yearsMapVs: 'cal_years_vs',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.cal_month_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Calendar Quarters',
      dataName: 'calQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'fiscalQuarters',
        'calYears',
        'calMonths',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years', // front end map to years (appears as map in query)
      yearsMapVs: 'cal_years_vs',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      groupByPeriod: 'p.cal_quarter_serial', // field for query used in trend group by
    },
    {
      // Checkbox
      label: 'Calendar Years (by Mo.)',
      dataName: 'calYears',
      default: false,
      // Check Rules
      onTrueSetFalse: [
        'fiscalWeeks',
        'fiscalPeriods',
        'fiscalYears_wk',
        'fiscalYears_per',
        'fiscalYears_qtr',
        'fiscalQuarters',
        'calMonths',
        'calQuarters',
      ],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years_multi',
      yearsMapVs: 'cal_years_inactive',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      yoy: true, // bool for front end to not show the start trend dropdown
      groupByPeriod: 'p.cal_year', // field for query used in trend group by
      yoyPeriodField: 'p.cal_month',
    },
  ]
}

// Need the following years maps to start being queried:
/*
fiscal_years_vs
fiscal_years_inactive
cal_years_vs
cal_years_inactive
*/

module.exports = trendTypeOptions
