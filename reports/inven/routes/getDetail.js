const router = require('express').Router()

router.post('/', async (req, res) => {
  console.log(`\nget detail route HIT...`)

  console.log(`get detail route COMPLETE. \n`)
  res.send({ message: `get detail route COMPLETE.` })
})

module.exports = router
