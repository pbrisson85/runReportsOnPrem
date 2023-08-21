const getReportConfig = reportName => {
  let config = null

  switch (reportName) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
      }
      break
    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
      }
      break
    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
      }
  }

  return config
}

module.exports = getReportConfig
