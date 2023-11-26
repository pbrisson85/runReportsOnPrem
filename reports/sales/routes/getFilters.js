const router = require('express').Router()
const getDistinctPrograms = require('../../../database/queries/postgres/getDistinctPrograms')
const getViewFilters = require('../data/filters/getViewFilters')
const getDistinctFiscalYears = require('../../../database/queries/postgres/getDistinctFiscalYears')
const getReportFormats = require('../data/filters/getReportFormats')
const trendTypeOptions = require('../data/filters/trendType')
const totalTypeOptions = require('../data/filters/totalTypes')
const projectionOptions = require('../data/filters/useProjections')
const getDataFilters = require('../data/filters/getDataFilters')
const { getDateEndPerWeek } = require('../../../database/queries/postgres/getDateEndPerWeek')
const {
  getFiscalPeriodsMap,
  getWeeksMap,
  getFiscalYearMap,
  getCurrentPeriods,
  getFiscalQuartersMap,
  getCalYearsMap,
  getCalMonthsMap,
  getCalQuartersMap,
  getFiscalYtdMap,
  getCalYtdMap,
} = require('../../../database/queries/postgres/filters/getDateMaps')
const getReportConfig = require('../utils/getReportConfig')
const appSettings = require('../data/filters/appSettings')
const getItemTypes = require('../../../database/queries/postgres/filters/getItemTypes')

// Generate Filter Data
router.post('/programs', async (req, res) => {
  console.log('get sales PROGRAMS filters lot route HIT...')
  // get config for applicable filters
  const config = getReportConfig(req.body)
  const programs = await getDistinctPrograms('2023', config) // Add the year to get defaults because right now it is hardcoded into the front end.
  programs.sort((a, b) => {
    if (a.label > b.label) return 1
    if (a.label < b.label) return -1
    return 0
  })
  res.send(programs)
  console.log('get sales PROGRAMS filters lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/views', async (req, res) => {
  console.log('get sales VIEWS filters lot route HIT...')
  const views = getViewFilters()
  res.send(views)
  console.log('get sales VIEWS filters lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/fy', async (req, res) => {
  console.log('get sales YEARS filters lot route HIT...')
  const fys = await getDistinctFiscalYears()
  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })
  res.send(fys)
  console.log('get sales YEARS filters lot route COMPLETE. ')
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

  // Note that FY YTD should have each week as a dropdown and only for the current year. and should not have years filtered out because that is not applicable.
  // OK - cal months doesnt show the date in the display.
  // OK - same for cal quarters
  // cal YTD should only have the calendar months from the current year in the drop downs.
  // OK - cal full year needs the dates in the dropdown.

  res.send({ fiscal_periods, weeks, fiscal_years, fiscal_quarters, cal_years, cal_months, cal_quarters, fiscal_ytd, cal_ytd }) // the key must match the "map" property in the query
  console.log('get periods maps lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/currentPeriods', async (req, res) => {
  let current = await getCurrentPeriods()

  // fiscal periods will go through the prior fiscal period completed (wed is cutoff)
  const todayWeek = current.week
  const today = new Date().getDay() // sunday is 0
  let shiftWeek = 1
  if (today <= 2) {
    // if sun, mon, tues then shift back two weeks for last closed week
    shiftWeek = 2
    // if wed, thur, fri, sat then shift back one wek for last closed week
  }
  const week = todayWeek - shiftWeek < 1 ? 1 : todayWeek - shiftWeek
  current.week = week

  // fiscal quarters will go through the prior fiscal quarter (wed is cutoff)
  // fiscal full year will go through the prior full fiscal year completed.
  // fiscal YTD will go through the prior week completed (wed is cutoff)
  // calendar month will go through prior calendar month
  // calendar year to date will go through prior completed calendar month
  // calendar year will go through prior completed calendar year.

  res.send(current)
  console.log('get periods maps lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/periods/:fy', async (req, res) => {
  console.log('get periods given fiscal year lot route HIT...')
  const periods = await getDateEndPerWeek(req.params.fy)
  res.send(periods)
  console.log('get periods given fiscal year lot route COMPLETE. ')
})

// Generate Filter Data
router.get('/reports', async (req, res) => {
  console.log('get report formats route HIT...')
  const reports = getReportFormats()
  res.send(reports)
  console.log('get report formats route COMPLETE. ')
})

// Generate Filter Data
router.get('/dataFilters', async (req, res) => {
  console.log('get data filters route HIT...')
  const reports = getDataFilters()
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
  const config = getReportConfig(req.body)
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
