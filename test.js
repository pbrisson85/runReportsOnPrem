// testing postgres js
const router = require('express').Router()

// db.js
const postgres = require('postgres')
const sql = postgres()

router.get('/', async (req, res) => {
  const item = await sql`
    select
      ms.item_num, ms.species
    from "invenReporting".master_supplement ms
    where ms.private_label_cust = 'DAMI00'
  `

  return item
})

module.exports = router
