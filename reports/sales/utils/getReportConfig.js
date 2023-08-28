const getReportConfig = reqBody => {
  /*
req.body:
columnDataName,
reqBody.reportFormat,
colType: col.colType,
fyTrendCol,
fyYtdTrendCol,
queryLevel: parseInt(row.datalevel),
viewingCustomerDrilldown,
viewingItemDrilldown,
inDrilldown,
periodStart,
periodEnd,
program,
showFyTrend,
year,
reqBody.reportFormat,
l1_filter: currentParams.l1_filter,
l2_filter: currentParams.l2_filter,
l3_filter: currentParams.l3_filter,
customer: l1_filter,
item: null,
*/

  console.log('reqBody', reqBody)

  // auth filters:
  let jbBuyerFilter = false

  const hasAuthFilters = reqBody.reportFormat.filters?.length > 0
  if (hasAuthFilters) {
    jbBuyerFilter = reqBody.reportFormat.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option
    if (reqBody.reportFormat === 'jbBuyer') jbBuyerFilter = true
  }

  // define config object
  let config = {
    program: typeof reqBody.program === 'undefined' ? null : reqBody.program === 'all' ? null : reqBody.program,
    l1_filter: reqBody.l1_filter ?? null,
    l2_filter: reqBody.l2_filter ?? null,
    l3_filter: reqBody.l3_filter ?? null,
    customer: reqBody.customer ?? null,
    item: reqBody.item ?? null,
    queryLevel: reqBody.queryLevel ?? null,
    jbBuyerFilter,
  }

  switch (reqBody.reportFormat) {
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
