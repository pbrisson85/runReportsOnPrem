const invenViews = () => {
  return [
    {
      label: 'Aged, 3mo Intervals',
      dataName: 'aged3Mo',
      default: false,
      // Check Rules
      trueOnNoSelection: false, // flags if this turns true when the selections are blank. Typically would mirror default flag if selection required
      ignoreInSelections: false, // rules will be applied but this box will never turn true
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [], // note that cant have an onFalse rule because of the ignoreInSelections rule. Can never be true
      maxSelections: 1, // limits the number of selections and sets all false if exceeded
      // data
      aging: [
        // note that this array is used to generate cols.
        {
          start: 0,
          end: 3,
          displayName: '< 3 mo.', // heading becomes the displayName
        },
        {
          start: 3,
          end: 6,
          displayName: '3 - 6 mo.',
        },
        {
          start: 6,
          end: 9,
          displayName: '6 - 9 mo.',
        },
        {
          start: 9,
          end: 12,
          displayName: '9 - 12 mo.',
        },
        {
          start: 12,
          end: 15,
          displayName: '12 - 15 mo.',
        },
        {
          start: 15,
          end: 18,
          displayName: '15 - 18 mo.',
        },
        {
          start: 18,
          end: 21,
          displayName: '18 - 21 mo.',
        },
        {
          start: 21,
          end: 24,
          displayName: '21 - 24 mo.',
        },
        {
          start: 24,
          end: 99,
          displayName: '> 24 mo.',
        },
      ],
    },
    {
      label: 'Aged, 6mo Intervals',
      dataName: 'aged6Mo',
      default: true,
      // Check Rules
      trueOnNoSelection: true,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: 1,
      // data
      aging: [
        // note that this array is used to generate cols.
        {
          start: 0,
          end: 6,
          displayName: '< 6 mo.', // heading becomes the displayName
          dataName: 'aged6Mo',
        },
        {
          start: 6,
          end: 12,
          displayName: '6 - 12 mo.',
          dataName: 'aged6to12Mo',
        },
        {
          start: 12,
          end: 18,
          displayName: '12 - 18 mo.',
          dataName: 'aged12to18Mo',
        },
        {
          start: 18,
          end: 24,
          displayName: '18 - 24 mo.',
          dataName: 'aged18to24Mo',
        },
        {
          start: 24,
          end: 99,
          displayName: '> 24 mo.',
          dataName: 'aged24PlusMo',
        },
      ],
    },
    {
      label: 'By Location',
      dataName: 'byLocation',
      default: false,
      // Check Rules
      trueOnNoSelection: false,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: 1,
      // data
      grouping: 'location',
    },
    {
      label: 'By Geography',
      dataName: 'byGeography',
      default: false,
      // Check Rules
      trueOnNoSelection: false,
      ignoreInSelections: false,
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [],
      maxSelections: 1,
      // data
      grouping: 'location',
    },
  ]
}

module.exports = invenViews
