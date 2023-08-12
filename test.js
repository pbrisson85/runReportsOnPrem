// testing postgres js
const router = require('express').Router()

// db.js
const postgres = require('postgres')
const sql = postgres()

router.get('/', async (req, res) => {
  const fileds = ['ms.item_num', 'ms.species']
  const table = `invenReporting.master_supplement`
  const fromAlias = 'ms'
  const whereField = 'ms.private_label_cust'
  const customerFilter = 'DAMI00'

  const item = await sql`
    select
      ${sql(fileds)}
    from ${sql(table)} AS ${sql(fromAlias)}
    where ${sql(whereField)} = ${customerFilter}
  `

  res.send(item)
})

module.exports = router
