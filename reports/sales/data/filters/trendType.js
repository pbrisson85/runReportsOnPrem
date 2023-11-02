// These filters are choose one only and it is passed to the back end.

const trendTypeOptions = () => {
  return [
    {
      label: 'Fiscal Weeks',
      dataName: 'fiscalWeeks',
      default: true,
      onTrueSetFalse: ['fiscalPeriods', 'fiscalQuarters', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'Fiscal Periods',
      dataName: 'fiscalPeriods',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalQuarters', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'Fiscal Quarters',
      dataName: 'fiscalQuarters',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'FY YTD',
      dataName: 'fyYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'FY Full Year',
      dataName: 'fyFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'calMonths', 'calYtd', 'calFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'Calendar Months',
      dataName: 'calMonths',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'Calendar YTD',
      dataName: 'calYtd',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear'],
      onFalseSetTrue: [],
    },
    {
      label: 'Calendar Full Year',
      dataName: 'calFullYear',
      default: false,
      onTrueSetFalse: ['fiscalWeeks', 'fiscalPeriods', 'fiscalQuarters', 'fyYtd', 'fyFullYear'],
      onFalseSetTrue: [],
    },
  ]
}

module.exports = trendTypeOptions
