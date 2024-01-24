const getProductionCountryFilters = require('../../../reports/filters/postgres/getProductionCountryFilters')

const getProductionCountriesDefault = async () => {
  const prodCountries = await getProductionCountryFilters()
  const defaultRecord = prodCountries.filter(country => country.default === true)
  const defaultProdCountries = defaultRecord.map(country => country.dataName)
  return defaultProdCountries
}

module.exports = getProductionCountriesDefault
