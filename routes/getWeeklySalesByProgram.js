const router = require('express').Router()

// @route   GET /api/sales/getSalesByProgram/:program
// @desc
// @access

// Generate sales data
router.get('/:program', async (req, res) => {
  console.log(`\nget get weekly sales by program: ${req.params.program} route HIT...`)

  console.log(`get weekly sales by program: ${req.params.program} route COMPLETE. \n`)
  res.send(`get weekly sales by program: ${req.params.program} route COMPLETE.`)
})

module.exports = router

/*
  Back end is proding this to the front end:
    "cols": [
        {
            "dataname": "2022-W01",
            "displayname": "4/9/2022"
        },
        {
            "dataname": "2022-W02",
            "displayname": "4/16/2022"
        },
        {
            "dataname": "2022-W03",
            "displayname": "4/23/2022"
        },


  "data": [
        {
            "species": "FLATHEAD",
            "size": "S",
            "type": "RM",
            "seafood_category": "FISH",
            "2022-W01": {
                "extended_cost": 66.5,
                "weight": 83.6,
                "cost_per_lb": 0.8
            },
            "2022-W06": {
                "extended_cost": 1935.04,
                "weight": 2365,
                "cost_per_lb": 0.82
            },

    "totals": [
        {
            "species": "FLATFISH CHN",
            "size": "total",
            "type": "",
            "seafood_category": "",
            "2022-W01": {
                "extended_cost": 206348.82,
                "weight": 252329,
                "cost_per_lb": 0.82
            },
  */
