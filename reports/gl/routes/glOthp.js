const router = require('express').Router()
const glOthp = require('../routines/glOthp')

// @route   GET /api/sales/gl/othp/:fy
// @desc
// @access

router.get('/:fy', async (req, res) => {
  console.log(`\nget period gl othp activity vs recalc for FY:${req.params.fy} route HIT...`)

  const resp = await glOthp(req.params.fy)

  console.log(`get period gl othp activity vs recalc for FY:${req.params.fy} route COMPLETE. \n`)
  res.send(resp)
})

module.exports = router
