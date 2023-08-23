const getReportConfig = reqBody => {
  let config = null

  const { reportName, creds } = reqBody

  switch (reportName) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
      break
    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
      break
    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
  }

  return config
}

module.exports = getReportConfig
