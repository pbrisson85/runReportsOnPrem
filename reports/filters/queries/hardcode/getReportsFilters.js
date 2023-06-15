const getReportsFilters = () => {
  return [
    {
      label: 'species group / program',
      dataName: 'speciesgroupProg',
      default: true,
    },
    {
      label: 'freeze / processing / size',
      dataName: 'frzSoakSize',
      default: false,
    },
    {
      label: 'species / brand / size',
      dataName: 'specBrndSize',
      default: false,
    },
    {
      label: 'species / soak / size',
      dataName: 'bySpecSoakSize',
      default: false,
    },
  ]
}

module.exports = getReportsFilters
