const getReportsFilters = () => {
  return [
    {
      label: 'species group / program',
      dataName: 'speciesgroupProg',
      defaults: ['all'], // list of programs (datanames) that this is the default report
      optional: ['all'], // list of programs (datanames) that allow this
      forbiddenCols: ['percentProgramSales'], // columns that will be hidden and will not show as optional
    },
    {
      label: 'species group / freeze',
      dataName: 'speciesgroupFreeze',
      defaults: [], // list of programs (datanames) that this is the default report
      optional: ['all'], // list of programs (datanames) that allow this
      forbiddenCols: ['percentProgramSales'], // columns that will be hidden and will not show as optional
    },
    {
      label: 'freeze / brand / size',
      dataName: 'frzBrndSize',
      default: true, // if true, this is the default report for an unlisted program (one which does not appear in the defaults array)
      defaults: ['COD USA', 'FLATFISH USA', 'HADDOCK USA', 'PERCH USA', 'POLLOCK USA', 'SCALLOPS DOMESTIC'], // list of programs (datanames) that this is the default report
      optional: ['any'], // list of programs (datanames) that allow this, or use 'any' to allow all programs EXCEPT 'all'
      forbiddenCols: [],
    },
    {
      label: 'freeze / soak / size',
      dataName: 'frzSoakSize',
      default: false, // if true, this is the default report for an unlisted program (one which does not appear in the defaults array)
      defaults: [], // list of programs (datanames) that this is the default report
      optional: ['any'], // list of programs (datanames) that allow this, or use 'any' to allow all programs EXCEPT 'all'
      forbiddenCols: [],
    },
    {
      label: 'species / brand / size',
      dataName: 'specBrndSize',
      defaults: ['COD CHN', 'FLATFISH CHN', 'FLATFISH PER', 'HADDOCK CHN', 'PERCH CHN', 'POLLOCK CHN', 'SEAFOOD OTHER'],
      optional: ['any'],
      forbiddenCols: [],
    },
    {
      label: 'species / soak / size',
      dataName: 'specSoakSize',
      defaults: ['SCALLOPS NON DOMESTIC'],
      optional: ['any'],
      forbiddenCols: [],
    },
  ]
}

module.exports = getReportsFilters
