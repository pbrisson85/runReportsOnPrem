const router = require('express').Router()
const glRevCogs = require('../routines/glRevCogs')

// @route   GET /api/sales/gl/revCogs/:fy
// @desc
// @access

router.get('/:fy', async (req, res) => {
  console.log(`\nget period gl revenue and COGS activity vs recalc for FY:${req.params.fy} route HIT...`)

  const resp = await glRevCogs(req.params.fym)

  console.log(`get period gl revenue and COGS activity vs recalc for FY:${req.params.fy} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
