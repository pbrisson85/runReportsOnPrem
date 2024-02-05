const miscOptions = () => {
  return [
    {
      label: "Include 1 lb wo's",
      dataName: 'include1lbWOs',
      default: false,
      trueOnNoSelection: false, // flags if this turns true when the selections are blank. Typically would mirror default flag if selection required
      ignoreInSelections: false, // rules will be applied but this box will never turn true
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [], // note that cant have an onFalse rule because of the ignoreInSelections rule. Can never be true
      maxSelections: false, // limits the number of selections and sets all false if exceeded
      // custom options
      include1lbWOs: true,
    },
    {
      label: "Include >1 lb wo's",
      dataName: 'includeGreaterlbWOs',
      default: true,
      trueOnNoSelection: false, // flags if this turns true when the selections are blank. Typically would mirror default flag if selection required
      ignoreInSelections: false, // rules will be applied but this box will never turn true
      onTrueSetTrue: [],
      onTrueSetFalse: [],
      onFalseSetTrue: [], // note that cant have an onFalse rule because of the ignoreInSelections rule. Can never be true
      maxSelections: false, // limits the number of selections and sets all false if exceeded
      // custom options
      includeGreaterlbWOs: true,
    },
  ]
}

module.exports = miscOptions

// *************Note that I also need to be able to apply multiple filters on the front end while in detail view.
