const router = require('express').Router()
const getDistinctPrograms = require('../queries/postgres/getDistinctPrograms')
const getViewFilters = require('../queries/hardcode/getViewFilters')
const getDistinctFiscalYears = require('../../shared/queries/postgres/getDistinctFiscalYears')
const { getDateEndPerWeek } = require('../../shared/queries/postgres/getDateEndPerWeek')

// @route   GET /api/sales/getFilters/programs
// @desc
// @access

// Generate Filter Data
router.get('/programs/:fy', async (req, res) => {
  console.log('\nget sales PROGRAMS filters lot route HIT...')

  const programs = await getDistinctPrograms(req.params.fy)
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

module.exports = router
