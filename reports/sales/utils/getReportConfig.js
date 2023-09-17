const getReportConfig = reqBody => {
  console.log('reqBody', reqBody)

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
  /* Add all sales invoice or sales order table query filters to this boolean. This controls item filters in Inv and PO */
  const hasSalesFilters = reqBody.salesPerson || reqBody.customer || reqBody.country || reqBody.state || reqBody.export || reqBody.northAmerica

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
    hasSalesFilters,
    queryLevel: reqBody.queryLevel ?? null,
    jbBuyerFilter,
    user: reqBody.user ?? null,
    showByProduct: reqBody.showByProduct ?? true, // test
    showSeconds: reqBody.showSeconds ?? true, // test
    itemType: reqBody.itemType?.replace(/['"]+/g, '') ?? 'FG', // test
  }

  // going to update the inven supplemental to put seconds and by product in item type then going to run this logic multiple times with different item types in sequence and then append the reports. and then add a final total row. the showByProduct, showSeconds flags will determine if the process should be run again with the different item types. Will also need to store the itme type in the data so that it can be passed in the request on right click.

  switch (reqBody.reportFormat) {
    case 'speciesgroupProg':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        ...config,
      }

      break

    case 'speciesgroupProgFrz':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        l3_name: 'fresh/frozen',
        ...config,
      }

      break

    case 'speciesgroupProgSpec':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l3_field: 'ms.species',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        l3_name: 'species',
        ...config,
      }

      break

    case 'speciesgroupBrandSkin':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.brand',
        l3_field: 'ms.fish_skin',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'skin',
        ...config,
      }
      break

    case 'speciesgroupSkinBrand':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fish_skin',
        l3_field: 'ms.brand',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'skin',
        l3_name: 'brand',
        ...config,
      }
      break

    case 'speciesgroupFreeze':
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'fresh/frozen',
        ...config,
      }
      break

    case 'frzBrndSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'size',
        ...config,
      }
      break

    case 'frzBrndSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'soak',
        l4_name: 'size',
        ...config,
      }
      break

    case 'frzSoakSize':
      config = {
        l1_field: 'ms.fg_fresh_frozen',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        l1_name: 'fresh/frozen', // Used for filter labels on front end
        l2_name: 'soak',
        l3_name: 'size',
        ...config,
      }
      break

    case 'specBrndSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'size',
        ...config,
      }
      break

    case 'specBrndSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.brand',
        l3_field: 'ms.fg_treatment',
        l4_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'brand',
        l3_name: 'soak',
        l4_name: 'size',
        ...config,
      }
      break

    case 'specSoakSize':
      config = {
        l1_field: 'ms.species',
        l2_field: 'ms.fg_treatment',
        l3_field: 'ms.size_name',
        l1_name: 'species', // Used for filter labels on front end
        l2_name: 'soak',
        l3_name: 'size',
        ...config,
      }
      break

    default:
      config = {
        l1_field: 'ms.species_group',
        l2_field: 'ms.program',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        ...config,
      }
  }

  console.log('config', config)

  return config
}

module.exports = getReportConfig
