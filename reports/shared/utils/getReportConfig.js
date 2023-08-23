const getReportConfig = reqBody => {
  let config = null

  const { format, creds } = reqBody

  switch (format) {
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

    case 'frzBrndSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
      break

    case 'frzSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
      break

    case 'specBrndSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        jbBuyerFilter: creds.filter === 'jbBuyer',
      }
      break

    case 'specSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
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
