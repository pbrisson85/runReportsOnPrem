const getReportConfig = reqBody => {
  // auth filters:
  let jbBuyerFilter = false

  const hasAuthFilters = reqBody.creds?.filters?.length > 0
  if (hasAuthFilters) {
    jbBuyerFilter = reqBody.creds.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option
    if (reqBody.dataFilters === 'jbBuyer') jbBuyerFilter = true
  }

  // define config object
  let config = {
    program: typeof reqBody.program === 'undefined' ? null : reqBody.program === 'all' ? null : reqBody.program,
    l1_filter: reqBody.l1_filter ?? null,
    l2_filter: reqBody.l2_filter ?? null,
    l3_filter: reqBody.l3_filter ?? null,
    l4_filter: reqBody.l4_filter ?? null,
    customer: reqBody.customer ?? null,
    item: reqBody.item ?? null,
    salesPerson: reqBody.salesPerson ?? null,
    country: reqBody.country ?? null,
    state: reqBody.state ?? null,
    export: reqBody.export ?? null,
    northAmerica: reqBody.northAmerica ?? null,
    queryLevel: reqBody.queryLevel ?? null,
    jbBuyerFilter,
    user: reqBody.user ?? null,
  }

  switch (reqBody.reportFormat) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        ...config,
      }

      break

    case 'speciesgroupProgFrz':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.fg_fresh_frozen',
        ...config,
      }

      break

    case 'speciesgroupProgSpec':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.species',
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

    case 'speciesgroupSkinBrand':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fish_skin',
        l3_field: 'ms.brand',
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

    case 'frzBrndSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
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

    case 'specBrndSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
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

  console.log('config', config)

  return config
}

module.exports = getReportConfig
