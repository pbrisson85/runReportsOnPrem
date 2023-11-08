const router = require('express').Router()
const getDistinctPrograms = require('../../../database/queries/postgres/getDistinctPrograms')
const getViewFilters = require('../data/filters/getViewFilters')
const getDistinctFiscalYears = require('../../../database/queries/postgres/getDistinctFiscalYears')
const getReportFormats = require('../data/filters/getReportFormats')
const trendTypeOptions = require('../data/filters/trendType')
const getDataFilters = require('../data/filters/getDataFilters')
const { getDateEndPerWeek } = require('../../../database/queries/postgres/getDateEndPerWeek')
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
