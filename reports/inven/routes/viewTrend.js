const router = require('express').Router()


router.post('/', async (req, res) => {
 
  console.log(`\n${config.user} - get drilldown data for ${reportFormat.dataName} route HIT...`)



  console.log(`${config.user} - get drilldown data for ${reportFormat.dataName} route COMPLETE. \n`)
  res.send({ response: 'success'})
})

module.exports = router
