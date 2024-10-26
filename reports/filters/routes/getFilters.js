const router = require('express').Router()
const getViewFilters_sales = require('../data/getViewFilters_sales')
const getViewFilters_inven = require('../data/getViewFilters_inven')
const getViewFilters_production = require('../data/getViewFilters_production')
const getReportFormats_sales = require('../data/getReportFormats_sales')
const getReportFormats_production = require('../data/getReportFormats_production')
const getReportFormats_inven = require('../data/getReportFormats_inven')
const trendTypeOptions = require('../data/trendType')
const projectionOptions = require('../data/useProjections')
const getPermissionFilters = require('../data/getPermissionFilters')
const appSettings = require('../data/appSettings')
const getInvenReportsOptions = require('../data/getInvenReportsOptions')
const getProductionCountryFilters = require('../postgres/getProductionCountryFilters')
const getItemTypeDefaults_inven = require('../data/getItemTypeDefaults_inven')
const getItemTypeDefaults_sales = require('../data/getItemTypeDefaults_sales')
const getItemTypeDefaults_production = require('../data/getItemTypeDefaults_production')
const getItemTypeDefaults_cashPo = require('../data/getItemTypeDefaults_cashPo')
const {
  getFiscalYearMap_multi,
  getCalYearsMap_multi,
  getFiscalYearMap,
  getCalYearsMap,
  getFiscalPeriodsMap,
  getWeeksMap,
  getFiscalQuartersMap,
  getCalMonthsMap,
  getCalQuartersMap,
  getFiscalVsYearMap,
  getFiscalInactiveYearMap,
  getCalInactiveYearsMap,
  getCalVsYearsMap,
} = require('../postgres/getDateMaps')
const getItemTypes = require('../postgres/getItemTypes')
const getItemTypes_cashPo = require('../postgres/getItemTypes_cashPo')
const getDistinctPrograms = require('../postgres/getDistinctPrograms')
const getReportConfig = require('../../utils/getReportConfig')
const getWoActivityGroups = require('../postgres/getWoActivityGroups')
const getMiscSettings_production = require('../data/getMiscSettings_production')

router.post('/productionActivity', async (req, res) => {
  console.log('get PRODUCTION ACTIVITY filters lot route HIT...')
  const config = await getReportConfig(req.body)
  const options = await getWoActivityGroups(config)
  res.send(options)
  console.log('get PRODUCTION ACTIVITY filters lot route COMPLETE. ')
})

router.post('/productionCountry', async (req, res) => {
  console.log('get PRODUCTION COUNTRY filters lot route HIT...')
  const config = await getReportConfig(req.body)
  const options = await getProductionCountryFilters(config)
  res.send(options)
  console.log('get PRODUCTION COUNTRY filters lot route COMPLETE. ')
})

router.get('/invenOptions', async (req, res) => {
  console.log('get INVEN OPTIONS filters lot route HIT...')
  const options = getInvenReportsOptions()
  res.send(options)
  console.log('get NVEN OPTIONS filters lot route COMPLETE. ')
})

router.post('/programs', async (req, res) => {
  console.log('get PROGRAMS filters lot route HIT...')
  const config = await getReportConfig(req.body)
  const programs = await getDistinctPrograms(config) // Fix this to pull from the inven, so, and projections tables.
  programs.sort((a, b) => {
    if (a.label > b.label) return 1
    if (a.label < b.label) return -1
    return 0
  })
  res.send(programs)
  console.log('get PROGRAMS filters lot route COMPLETE. ')
})

router.get('/salesViews', async (req, res) => {
  console.log('get VIEWS filters lot route HIT...')
  const views = await getViewFilters_sales()
  res.send(views)
  console.log('get VIEWS filters lot route COMPLETE. ')
})

router.get('/invenViews', async (req, res) => {
  console.log('get VIEWS filters lot route HIT...')
  const views = getViewFilters_inven()
  res.send(views)
  console.log('get VIEWS filters lot route COMPLETE. ')
})

router.get('/productionViews', async (req, res) => {
  console.log('get VIEWS filters lot route HIT...')
  const views = getViewFilters_production()
  res.send(views)
  console.log('get VIEWS filters lot route COMPLETE. ')
})

router.get('/periodMaps', async (req, res) => {
  console.log('get period maps route HIT...')

  // Period Maps
  const fiscal_periods = await getFiscalPeriodsMap()
  const weeks = await getWeeksMap()
  const fiscal_quarters = await getFiscalQuartersMap()
  const cal_months = await getCalMonthsMap()
  const cal_quarters = await getCalQuartersMap()

  // Year Maps
  const fiscal_years = await getFiscalYearMap()
  const cal_years = await getCalYearsMap()
  const fiscal_years_multi = await getFiscalYearMap_multi()
  const cal_years_multi = await getCalYearsMap_multi()
  const fiscal_years_vs = await getFiscalVsYearMap()
  const fiscal_years_inactive = await getFiscalInactiveYearMap()
  const cal_years_vs = await getCalVsYearsMap()
  const cal_years_inactive = await getCalInactiveYearsMap()

  res.send({
    fiscal_periods,
    weeks,
    fiscal_quarters,
    cal_months,
    cal_quarters,
    fiscal_years,
    fiscal_years_multi,
    cal_years,
    cal_years_multi,
    fiscal_years_vs,
    fiscal_years_inactive,
    cal_years_vs,
    cal_years_inactive,
  }) // the key must match the "map" property in the query
  console.log('get periods maps lot route COMPLETE. ')
})

router.get('/miscFiltersProduction', async (req, res) => {
  console.log('get misc production filters route HIT...')
  const r = getMiscSettings_production()
  res.send(r)
  console.log('get report formats route COMPLETE. ')
})

router.get('/invenRowFormats', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats_inven()
  res.send(reports)
  console.log('get report formats route COMPLETE. ')
})

router.get('/salesRowFormats', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats_sales()
  res.send(reports)
  console.log('get report formats route COMPLETE. ')
})

router.get('/productionRowFormats', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats_production()
  res.send(reports)
  console.log('get report formats route COMPLETE. ')
})

router.get('/dataPermissions', async (req, res) => {
  console.log('get data filters route HIT...')
  const reports = getPermissionFilters()
  res.send(reports)
  console.log('get data filters route COMPLETE. ')
})

router.get('/trendFilters', async (req, res) => {
  console.log('get trend filters route HIT...')
  const reports = trendTypeOptions()
  res.send(reports)
  console.log('get trend filters route COMPLETE. ')
})

router.get('/projectionFilters', async (req, res) => {
  console.log('get projection filters route HIT...')
  const reports = projectionOptions()
  res.send(reports)
  console.log('get projection filters route COMPLETE. ')
})

router.get('/invenItemTypes', async (req, res) => {
  console.log('get item types filters route HIT...')
  req.body.module = 'inven'

  const config = await getReportConfig(req.body)
  let types = await getItemTypes(config)
  const defaults = getItemTypeDefaults_inven()

  types = types.map(type => {
    return {
      ...type,
      default: defaults.includes(type.dataName),
    }
  })

  res.send(types)
  console.log('get item types filters route COMPLETE. ')
})

router.get('/cashPoItemTypes', async (req, res) => {
  console.log('get item types filters route HIT...')

  let types = await getItemTypes_cashPo()
  const defaults = getItemTypeDefaults_cashPo()

  types = types.map(type => {
    return {
      ...type,
      default: defaults.includes(type.dataName),
    }
  })

  res.send(types)
  console.log('get item types filters route COMPLETE. ')
})

router.get('/salesItemTypes', async (req, res) => {
  console.log('get item types filters route HIT...')
  req.body.module = 'sales'

  const config = await getReportConfig(req.body)
  let types = await getItemTypes(config)
  const defaults = getItemTypeDefaults_sales()

  types = types.map(type => {
    return {
      ...type,
      default: defaults.includes(type.dataName),
    }
  })

  res.send(types)
  console.log('get item types filters route COMPLETE. ')
})

router.get('/productionItemTypes', async (req, res) => {
  console.log('get item types filters route HIT...')

  req.body.module = 'production'

  const config = await getReportConfig(req.body)
  let types = await getItemTypes(config)
  const defaults = getItemTypeDefaults_production()

  types = types.map(type => {
    return {
      ...type,
      default: defaults.includes(type.dataName),
    }
  })

  res.send(types)
  console.log('get item types filters route COMPLETE. ')
})

router.get('/appSettings', async (req, res) => {
  console.log('get app settings route HIT...')
  const settings = appSettings()
  res.send(settings)
  console.log('get app settings route COMPLETE. ')
})

module.exports = router
