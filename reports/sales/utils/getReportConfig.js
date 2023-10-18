const appSettings = require('../data/filters/appSettings')
const unflattenByCompositKey = require('../../../models/unflattenByCompositKey')

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

  // get subtotalRowFormats defaults
  const appSettingsData = appSettings()
  const appSettings_unflat = unflattenByCompositKey(appSettingsData, { 1: 'dataName' })

  // The itemType comes from hardcoding a field into the rows and then passing back. Since it is an array truned into a string then it gets double quotes around it. This parses the strange format that postgres returns. Note that the total row gets entered into the row as an actual array which is why this is tested for a string.
  if (typeof reqBody.itemType !== 'undefined' && typeof reqBody.itemType === 'string') {
    reqBody.itemType = [...reqBody.itemType.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(',')]
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
    itemType: reqBody.itemType ?? ['FG'],
    freshFrozen: reqBody.freshFrozen ?? null,
    custType: reqBody.custType ?? null,
    speciesGroup: reqBody.speciesGroup ?? null,
    species: reqBody.species ?? null,
    programDrilldown: reqBody.programDrilldown ?? null,
    views: {
      useProjection: false, // reqBody.creds.admin ?? false, // temporarily use the admin credential to determine if the projection view should be used DURING TESTING
    },
    jbBuyerFilter,
    user: reqBody.user ?? null,
    subtotalRowFormats: {
      shiftTotals: reqBody.appSettings?.shiftTotals ?? appSettings_unflat['shiftTotals'].default,
      shiftTotalsCss: reqBody.appSettings?.shiftTotalsCss ?? appSettings_unflat['shiftTotalsCss'].default,
      dataLabelInSubtotals: reqBody.appSettings?.dataLabelInSubtotals ?? appSettings_unflat['dataLabelInSubtotals'].default,
      subtotalLabelInSubtotals: reqBody.appSettings?.subtotalLabelInSubtotals ?? appSettings_unflat['subtotalLabelInSubtotals'].default,
    },
  }

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
        l3_field: 'ms.fg_fresh_frozen',
        l1_name: 'species group', // Used for filter labels on front end
        l2_name: 'program',
        l3_name: 'fresh/frozen',
        ...config,
      }
  }

  console.log('config: ', config)

  return config
}

module.exports = getReportConfig
