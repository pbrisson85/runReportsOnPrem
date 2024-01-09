const router = require('express').Router()
const getViewFilters_sales = require('../data/getViewFilters_sales')
const getViewFilters_inven = require('../data/getViewFilters_inven')
const getViewFilters_production = require('../data/getViewFilters_production')
const getReportFormats_sales = require('../data/getReportFormats_sales')
const getReportFormats_production = require('../data/getReportFormats_production')
const getReportFormats_inven = require('../data/getReportFormats_inven')
const trendTypeOptions = require('../data/trendType')
const totalTypeOptions = require('../data/totalTypes')
const projectionOptions = require('../data/useProjections')
const getPermissionFilters = require('../data/getPermissionFilters')
const appSettings = require('../data/appSettings')
const getInvenReportsOptions = require('../data/getInvenReportsOptions')
const getProductionCountryFilters = require('../postgres/getProductionCountryFilters')
const getItemTypeDefaults_inven = require('../data/getItemTypeDefaults_inven')
const getItemTypeDefaults_sales = require('../data/getItemTypeDefaults_sales')
const getItemTypeDefaults_production = require('../data/getItemTypeDefaults_production')
const {
  getFiscalPeriodsMap,
  getWeeksMap,
  getFiscalYearMap,
  getFiscalQuartersMap,
  getCalYearsMap,
  getCalMonthsMap,
  getCalQuartersMap,
  getFiscalYtdMap,
  getCalYtdMap,
} = require('../postgres/getDateMaps')
const getItemTypes = require('../postgres/getItemTypes')
const getDistinctPrograms = require('../postgres/getDistinctPrograms')
const getReportConfig = require('../../utils/getReportConfig')

router.post('/productionCountry', async (req, res) => {
  console.log('get PRODUCTION COUNTRY filters lot route HIT...')
  const config = await getReportConfig(req.body)
  const options = getProductionCountryFilters(config)
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
  const views = getViewFilters_sales()
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
  let fiscal_periods = await getFiscalPeriodsMap()
  let weeks = await getWeeksMap()
  let fiscal_years = await getFiscalYearMap()
  let fiscal_quarters = await getFiscalQuartersMap()
  let cal_years = await getCalYearsMap()
  let cal_months = await getCalMonthsMap()
  let cal_quarters = await getCalQuartersMap()
  let fiscal_ytd = await getFiscalYtdMap()
  let cal_ytd = await getCalYtdMap()

  res.send({ fiscal_periods, weeks, fiscal_years, fiscal_quarters, cal_years, cal_months, cal_quarters, fiscal_ytd, cal_ytd }) // the key must match the "map" property in the query
  console.log('get periods maps lot route COMPLETE. ')
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

router.get('/totalsFilters', async (req, res) => {
  console.log('get totals filters route HIT...')
  const reports = totalTypeOptions()
  res.send(reports)
  console.log('get totals filters route COMPLETE. ')
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
