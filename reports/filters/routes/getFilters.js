const router = require('express').Router()
const getViewFilters_sales = require('../data/getViewFilters_sales')
const getViewFilters_inven = require('../data/getViewFilters_inven')
const getReportFormats = require('../data/getReportFormats')
const trendTypeOptions = require('../data/trendType')
const totalTypeOptions = require('../data/totalTypes')
const projectionOptions = require('../data/useProjections')
const getPermissionFilters = require('../data/getPermissionFilters')
const appSettings = require('../data/appSettings')
const getInvenReportsOptions = require('../data/getInvenReportsOptions')

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

router.get('/invenOptions', async (req, res) => {
  console.log('get INVEN OPTIONS filters lot route HIT...')
  // get config for applicable filters
  const options = getInvenReportsOptions()
  res.send(options)
  console.log('get NVEN OPTIONS filters lot route COMPLETE. ')
})

router.post('/programs', async (req, res) => {
  console.log('get PROGRAMS filters lot route HIT...')
  // get config for applicable filters
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

router.get('/rowFormats', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats()
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

router.get('/itemTypes', async (req, res) => {
  console.log('get item types filters route HIT...')
  // get config for applicable filters
  const config = await getReportConfig(req.body)
  let types = await getItemTypes('2023', config) // Add the year to get defaults because right now it is hardcoded into the front end.

  // Add default manually ************ add this to getDefaults ******************************
  types = types.map(type => {
    return {
      ...type,
      default: type.dataName === 'FG' || type.dataName === 'SECONDS',
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
