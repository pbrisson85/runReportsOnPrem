const router = require('express').Router()
const getDistinctPrograms = require('../queries/postgres/filters/getDistinctPrograms')
const getViewFilters = require('../queries/hardcode/getViewFilters')

// @route   GET /api/sales/getFilters/programs
// @desc
// @access

// Generate Filter Data
router.get('/programs', async (req, res) => {
  console.log('\nget sales PROGRAMS filters lot route HIT...')

  const programs = await getDistinctPrograms()
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
  console.log('\nget get sales VIEWS filters lot route HIT...')

  const views = getViewFilters()

  res.send(views)
  console.log('get sales VIEWS filters lot route COMPLETE. \n')
})

module.exports = router
