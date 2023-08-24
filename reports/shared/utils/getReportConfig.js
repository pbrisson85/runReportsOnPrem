const getReportConfig = reqBody => {
  const { format, creds, dataFilters, program } = reqBody

  // auth filters:
  let jbBuyerFilter = false

  const hasAuthFilters = creds.filters?.length > 0
  if (hasAuthFilters) {
    jbBuyerFilter = creds.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option

    if (dataFilters === 'jbBuyer') jbBuyerFilter = true
  }

  // define config object
  let config = {
    program: typeof program === 'undefined' ? null : program === 'all' ? null : program,
    jbBuyerFilter,
  }

  console.log('config', config)

  switch (format) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        ...config,
      }

      break

    case 'speciesgroupBrandSkin':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.brand',
        l3_field: 'ms.fish_skin',
        ...config,
      }
      break

    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        ...config,
      }
      break

    case 'frzBrndSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        ...config,
      }
      break

    case 'frzSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        ...config,
      }
      break

    case 'specBrndSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        ...config,
      }
      break

    case 'specSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        ...config,
      }
      break

    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        ...config,
      }
  }

  return config
}

module.exports = getReportConfig
