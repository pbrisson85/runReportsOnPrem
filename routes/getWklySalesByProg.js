const router = require('express').Router()
const getWklySalesByProg = require('../routines/getWklyProgSales')

// @route   POST /api/sales/getSalesByProgram
// @desc
// @access

// Generate sales data
router.post('/', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.body.program} for ${req.body.start} through ${req.body.end} route HIT...`)

  const resp = await getWklySalesByProg(req.body.program, req.body.start, req.body.end)

  console.log(`get get weekly sales by program: ${req.body.program} for ${req.body.start} through ${req.body.end} route COMPLETE. \n`)
  res.send(resp)
  //res.send({ data, cols })
})

module.exports = router

/*
{
    "data": [
        {
            "row": "DRY",
            "2022-W17": {
                "weight": 52800,
                "revenue": 261360,
                "cogs": 218755.68,
                "othp": 2397.12,
                "netSales": 258962.88,
                "grossMargin": 40207.2,
                "revenuePerLb": 4.95,
                "cogsPerLb": 4.14,
                "othpPerLb": 0.05,
                "netSalesPerLb": 4.9,
                "grossMarginPerLb": 0.76
            },
      "cols": [
        {
            "dataname": "2022-W01",
            "displayname": "4/9/2022"
        },
        {
            "dataname": "2022-W02",
            "displayname": "4/16/2022"
        },
*/
