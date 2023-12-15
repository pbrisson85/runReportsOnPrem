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
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'weeks', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years', // determines what map to use for the years menu. (dont show years, show fiscal, show calendar)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      queryPeriod: 'p.week_serial', // field for query used in trend group by
      // Custom Sync Rules
      totalDefault: 'fyYtd', // If current total is not included in totals allowed then this totaldataName will be selected
      totalsAllowed: ['fyYtd'],
    },
    {
      // Checkbox
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_periods', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'period', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      queryPeriod: 'p.period_serial', // field for query used in trend group by
      // Custom Sync Rules
      totalDefault: 'fyYtd', // If current total is not included in totals allowed then this totaldataName will be selected
      totalsAllowed: ['fyYtd'],
    },
    {
      // Checkbox
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'fiscal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'fiscal_years',
      currentDateMap: 'fiscal_quarter', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      queryPeriod: 'p.quarter_serial', // field for query used in trend group by
      // Custom Sync Rules
      totalDefault: 'fyYtd', // If current total is not included in totals allowed then this totaldataName will be selected
      totalsAllowed: ['fyYtd'],
    },
    // {
    //   // Checkbox
    //   label: 'Fiscal Years',
    //   dataName: 'fyYtd',
    //   default: false,
    //   // Check Rules
    //   onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyFullYear', 'calMonths', 'calYtd', 'calFullYear', 'calQuarters'],
    //   onFalseSetTrue: [],
    //   // Custom
    //   periodsMap: 'fiscal_ytd', // front end map to filter (appears as map in query)
    //   yearsMap: 'fiscal_years',
    //   currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    //   ytd: true, // bool for front end to not show the start trend dropdown
    //   queryPeriod: 'p.fiscal_year', // field for query used in trend group by
    //   // Custom Sync Rules
    //   totalDefault: 'fyYtd', // If current total is not included in totals allowed then this totaldataName will be selected
    //   totalsAllowed: ['fyYtd'],
    // },
    {
      // Checkbox
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calQuarters'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_months', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years',
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      queryPeriod: 'p.cal_month_serial', // field for query used in trend group by
      // Custom Sync Rules
      totalDefault: 'calYtd', // If current total is not included in totals allowed then this totaldataName will be selected
      totalsAllowed: ['calYtd'],
    },
    {
      // Checkbox
      label: 'Calendar Quarters',
      dataName: 'calQuarters',
      default: false,
      // Check Rules
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calYtd', 'calFullYear', 'calMonths'],
      onFalseSetTrue: [],
      // Custom
      periodsMap: 'cal_quarters', // front end map to filter (appears as map in query)
      yearsMap: 'cal_years', // front end map to years (appears as map in query)
      currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
      queryPeriod: 'p.cal_quarter_serial', // field for query used in trend group by
      // Custom Sync Rules
      totalDefault: 'calYtd', // If current total is not included in totals allowed then this totaldataName will be selected
      totalsAllowed: ['calYtd'],
    },
    // {
    //   // Checkbox
    //   label: 'Calendar Years',
    //   dataName: 'calYtd',
    //   default: false,
    //   // Check Rules
    //   onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fyYtd', 'fyFullYear', 'fiscalQuarters', 'calMonths', 'calFullYear', 'calQuarters'],
    //   onFalseSetTrue: [],
    //   // Custom
    //   periodsMap: 'cal_ytd', // front end map to filter (appears as map in query)
    //   yearsMap: 'cal_years',
    //   currentDateMap: 'week', // must map to the field in the getCurrentPeriods query so front end can map to the correct default date
    //   ytd: true, // bool for front end to not show the start trend dropdown
    //   queryPeriod: 'p.cal_year', // field for query used in trend group by
    //   // Custom Sync Rules
    //   totalDefault: 'calYtd', // If current total is not included in totals allowed then this totaldataName will be selected
    //   totalsAllowed: ['calYtd'],
    // },
  ]
}

module.exports = trendTypeOptions
