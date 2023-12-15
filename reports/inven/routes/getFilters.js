const router = require('express').Router()

const getViewFilters = require('../data/filters/getViewFilters')
const getReportFormats = require('../data/filters/getReportFormats')
const trendTypeOptions = require('../data/filters/trendType')
const totalTypeOptions = require('../data/filters/totalTypes')
const projectionOptions = require('../data/filters/useProjections')
const getPermissionFilters = require('../data/filters/getPermissionFilters')
const appSettings = require('../data/filters/appSettings')

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
} = require('../postgres/filters/getDateMaps')
const getItemTypes = require('../postgres/filters/getItemTypes')
const getDistinctPrograms = require('../postgres/filters/getDistinctPrograms')

const getReportConfig = require('../../utils/getReportConfig')

// Generate Filter Data
router.post('/programs', async (req, res) => {
  console.log('get inven PROGRAMS filters lot route HIT...')
  // get config for applicable filters
  const config = await getReportConfig(req.body)
  const programs = await getDistinctPrograms(config) // Fix this to pull from the inven, so, and projections tables.
  programs.sort((a, b) => {
    if (a.label > b.label) return 1
    if (a.label < b.label) return -1
    return 0
  })
  res.send(programs)
  console.log('get inven PROGRAMS filters lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/views', async (req, res) => {
  console.log('get inven VIEWS filters lot route HIT...')
  const views = getViewFilters()
  res.send(views)
  console.log('get inven VIEWS filters lot route COMPLETE. ')
})

// Generate Filter Data
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

// Generate Filter Data
router.get('/rowFormats', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats()
  res.send(reports)
  console.log('get report formats route COMPLETE. ')
})

// Generate Filter Data
router.get('/dataFilters', async (req, res) => {
  console.log('get data filters route HIT...')
  const reports = getPermissionFilters()
  res.send(reports)
  console.log('get data filters route COMPLETE. ')
})

// Generate Filter Data
router.get('/trendFilters', async (req, res) => {
  console.log('get trend filters route HIT...')
  const reports = trendTypeOptions()
  res.send(reports)
  console.log('get trend filters route COMPLETE. ')
})

// Generate Filter Data
router.get('/totalsFilters', async (req, res) => {
  console.log('get totals filters route HIT...')
  const reports = totalTypeOptions()
  res.send(reports)
  console.log('get totals filters route COMPLETE. ')
})

// Generate Filter Data
router.get('/projectionFilters', async (req, res) => {
  console.log('get projection filters route HIT...')
  const reports = projectionOptions()
  res.send(reports)
  console.log('get projection filters route COMPLETE. ')
})

// Generate Filter Data
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

// Get App Admin Settings
router.get('/appSettings', async (req, res) => {
  console.log('get app settings route HIT...')
  const settings = appSettings()
  res.send(settings)
  console.log('get app settings route COMPLETE. ')
})

module.exports = router
