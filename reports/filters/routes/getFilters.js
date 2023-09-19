const router = require('express').Router()
const getDistinctPrograms = require('../queries/postgres/getDistinctPrograms')
const getViewFilters = require('../queries/hardcode/getViewFilters')
const getDistinctFiscalYears = require('../../sales/queries/postgres/getDistinctFiscalYears')
const getReportFormats = require('../queries/hardcode/getReportFormats')
const getReportFilters = require('../queries/hardcode/getReportFilters')
const getDataFilters = require('../queries/hardcode/getDataFilters')
const { getDateEndPerWeek } = require('../../sales/queries/postgres/getDateEndPerWeek')
const getReportConfig = require('../../sales/utils/getReportConfig')

// @route   GET /api/sales/getFilters/programs
// @desc
// @access

// Generate Filter Data
router.post('/programs', async (req, res) => {
  console.log('\nget sales PROGRAMS filters lot route HIT...')

  // get config for applicable filters
  const config = getReportConfig(req.body)
  const programs = await getDistinctPrograms(req.body.fy, { jbBuyerFilter: config.jbBuyerFilter })

  programs.sort((a, b) => {
    if (a.label > b.label) return 1
    if (a.label < b.label) return -1
    return 0
  })

  res.send(programs)
  console.log('get sales PROGRAMS filters lot route COMPLETE. \n')
})

// @route   GET api/sales/getFilters/views
// @desc
// @access

// Generate Filter Data
router.get('/views', async (req, res) => {
  console.log('\nget sales VIEWS filters lot route HIT...')

  const views = getViewFilters()

  res.send(views)
  console.log('get sales VIEWS filters lot route COMPLETE. \n')
})

// @route   GET api/sales/getFilters/fy
// @desc
// @access

// Generate Filter Data
router.get('/fy', async (req, res) => {
  console.log('\nget sales YEARS filters lot route HIT...')

  const fys = await getDistinctFiscalYears()

  // sort largest to smallest
  fys.sort((a, b) => {
    if (a.label > b.label) return -1
    if (a.label < b.label) return 1
    return 0
  })

  res.send(fys)
  console.log('get sales YEARS filters lot route COMPLETE. \n')
})

// @route   GET api/sales/getFilters/periods/:fy
// @desc
// @access

// Generate Filter Data
router.get('/periods/:fy', async (req, res) => {
  console.log('\nget periods given fiscal year lot route HIT...')

  const periods = await getDateEndPerWeek(req.params.fy)

  res.send(periods)
  console.log('get periods given fiscal year lot route COMPLETE. \n')
})

// @route   GET api/sales/getFilters/reports
// @desc
// @access

// Generate Filter Data
router.get('/reports', async (req, res) => {
  console.log('\nget report formats route HIT...')

  const reports = getReportFormats()

  res.send(reports)
  console.log('get report formats route COMPLETE. \n')
})

// Generate Filter Data
router.get('/dataFilters', async (req, res) => {
  console.log('\nget data filters route HIT...')

  const reports = getDataFilters()

  res.send(reports)
  console.log('get data filters route COMPLETE. \n')
})

// Generate Filter Data
router.get('/viewFilters', async (req, res) => {
  console.log('\nget report filters route HIT...')

  const reports = getReportFilters()

  res.send(reports)
  console.log('get report filters route COMPLETE. \n')
})

module.exports = router
