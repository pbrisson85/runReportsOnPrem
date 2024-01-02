// in row slices often there is ALL inventory items unrelated to the specific filters being applies. For example if in the filter chain is a customer specific filter, being a filter on a sales or sales order or customer master table then the row slice will have all inventory items filtered for relevant inventory filters but not filtered for relavant sales filters. To fix this I am inplementing this helper which is MANUALLY asking if certain filters exist. I put this here and added a TODO in the README to make this more dynamic.

const rowSliceHasSalesFilter = config => {
  return (
    config.trendFilters.customer ||
    config.trendFilters.custType ||
    config.trendFilters.salesPerson ||
    config.trendFilters.country ||
    config.trendFilters.state ||
    config.trendFilters.export ||
    config.trendFilters.northAmerica
  )
}

module.exports = rowSliceHasSalesFilter
