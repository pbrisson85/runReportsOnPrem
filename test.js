// testing postgres js
const router = require('express').Router()

// db.js
const postgres = require('postgres')
const sql = postgres()

router.get('/', async (req, res) => {
  const customerFilter = 'DAMI00'
  const fileds = ['ms.item_num', 'ms.species']
  const table = `'invenReporting'.master_supplement AS ms`

  const item = await sql`
    select
      ${sql(fileds)}
    from ${sql(table)}
    where ms.private_label_cust = ${customerFilter}
  `

  res.send(item)
})

module.exports = router
