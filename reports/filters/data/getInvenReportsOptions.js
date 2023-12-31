const invenViews = () => {
  return [
    {
      label: 'Aged, 1mo Intervals',
      dataName: 'aged1Mo',
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
          end: 0,
          start: 1,
          displayName: '< 1 mo.', // heading becomes the displayName
          dataName: 'aged1Mo',
        },
        {
          end: 1,
          start: 2,
          displayName: '1 - 2 mo.',
          dataName: 'aged1to2Mo',
        },
        {
          end: 2,
          start: 3,
          displayName: '2 - 3 mo.',
          dataName: 'aged2to3Mo',
        },
        {
          end: 3,
          start: 4,
          displayName: '3 - 4 mo.',
          dataName: 'aged3to4Mo',
        },
        {
          end: 4,
          start: 5,
          displayName: '4 - 5 mo.',
          dataName: 'aged4to5Mo',
        },
        {
          end: 5,
          start: 6,
          displayName: '5 - 6 mo.',
          dataName: 'aged5to6Mo',
        },
        {
          end: 6,
          start: 7,
          displayName: '6 - 7 mo.',
          dataName: 'aged6to7Mo',
        },
        {
          end: 7,
          start: 8,
          displayName: '7 - 8 mo.',
          dataName: 'aged7to8Mo',
        },
        {
          end: 8,
          start: 9,
          displayName: '8 - 9 mo.',
          dataName: 'aged8to9Mo',
        },
        {
          end: 9,
          start: 10,
          displayName: '9 - 10 mo.',
          dataName: 'aged9to10Mo',
        },
        {
          end: 10,
          start: 11,
          displayName: '10 - 11 mo.',
          dataName: 'aged10to11Mo',
        },
        {
          end: 11,
          start: 12,
          displayName: '11 - 12 mo.',
          dataName: 'aged11to12Mo',
        },
        {
          end: 12,
          start: 13,
          displayName: '12 - 13 mo.',
          dataName: 'aged12to13Mo',
        },
        {
          end: 13,
          start: 14,
          displayName: '13 - 14 mo.',
          dataName: 'aged13to14Mo',
        },
        {
          end: 14,
          start: 15,
          displayName: '14 - 15 mo.',
          dataName: 'aged14to15Mo',
        },
        {
          end: 15,
          start: 16,
          displayName: '15 - 16 mo.',
          dataName: 'aged15to16Mo',
        },
        {
          end: 16,
          start: 17,
          displayName: '16 - 17 mo.',
          dataName: 'aged16to17Mo',
        },
        {
          end: 17,
          start: 18,
          displayName: '17 - 18 mo.',
          dataName: 'aged17to18Mo',
        },
        {
          end: 18,
          start: 19,
          displayName: '18 - 19 mo.',
          dataName: 'aged18to19Mo',
        },
        {
          end: 19,
          start: 20,
          displayName: '19 - 20 mo.',
          dataName: 'aged19to20Mo',
        },
        {
          end: 20,
          start: 21,
          displayName: '20 - 21 mo.',
          dataName: 'aged20to21Mo',
        },
        {
          end: 21,
          start: 22,
          displayName: '21 - 22 mo.',
          dataName: 'aged21to22Mo',
        },
        {
          end: 22,
          start: 23,
          displayName: '22 - 23 mo.',
          dataName: 'aged22to23Mo',
        },
        {
          end: 23,
          start: 24,
          displayName: '23 - 24 mo.',
          dataName: 'aged23to24Mo',
        },
        {
          end: 24,
          start: 999,
          displayName: '> 24 mo.',
          dataName: 'aged24PlusMo',
        },
      ],
    },
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
          end: 0,
          start: 3,
          displayName: '< 3 mo.', // heading becomes the displayName
          dataName: 'aged3Mo',
        },
        {
          end: 3,
          start: 6,
          displayName: '3 - 6 mo.',
          dataName: 'aged3to6Mo',
        },
        {
          end: 6,
          start: 9,
          displayName: '6 - 9 mo.',
          dataName: 'aged6to9Mo',
        },
        {
          end: 9,
          start: 12,
          displayName: '9 - 12 mo.',
          dataName: 'aged9to12Mo',
        },
        {
          end: 12,
          start: 15,
          displayName: '12 - 15 mo.',
          dataName: 'aged12to15Mo',
        },
        {
          end: 15,
          start: 18,
          displayName: '15 - 18 mo.',
          dataName: 'aged15to18Mo',
        },
        {
          end: 18,
          start: 21,
          displayName: '18 - 21 mo.',
          dataName: 'age18to21Mo',
        },
        {
          end: 21,
          start: 24,
          displayName: '21 - 24 mo.',
          dataName: 'aged21to24Mo',
        },
        {
          end: 24,
          start: 99,
          displayName: '> 24 mo.',
          dataName: 'aged24PlusMo',
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
          end: 0,
          start: 6,
          displayName: '< 6 mo.', // heading becomes the displayName
          dataName: 'aged6Mo',
        },
        {
          end: 6,
          start: 12,
          displayName: '6 - 12 mo.',
          dataName: 'aged6to12Mo',
        },
        {
          end: 12,
          start: 18,
          displayName: '12 - 18 mo.',
          dataName: 'aged12to18Mo',
        },
        {
          end: 18,
          start: 24,
          displayName: '18 - 24 mo.',
          dataName: 'aged18to24Mo',
        },
        {
          end: 24,
          start: 99,
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
