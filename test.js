// testing postgres js
const router = require('express').Router()

// db.js
const postgres = require('postgres')
const sql = postgres()

router.get('/', async (req, res) => {
  const customer = 'DAMI00'
  const fileds = ['ms.item_num', 'ms.species']

  const item = await sql`
    select
      ${sql(fileds)}
    from "invenReporting".master_supplement ms
    where ms.private_label_cust = ${customer}
  `

  res.send(item)
})

module.exports = router
