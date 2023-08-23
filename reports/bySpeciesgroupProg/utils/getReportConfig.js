const getReportConfig = reportName => {
  let config = null

  switch (reportName) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        jbBuyerFilter: true,
      }
      break
    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        jbBuyerFilter: true,
      }
      break
    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        jbBuyerFilter: true,
      }
  }

  return config
}

module.exports = getReportConfig
