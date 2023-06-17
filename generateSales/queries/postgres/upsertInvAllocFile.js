const upsertInvAllocData = async data_unflat => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log('upsert data to postgres by invoice/line/othp code ...')

    const keys = Object.keys(data_unflat)

    let promises = []
    let i = 0
    for (key of keys) {
      const netExpense = data_unflat[key].reduce((acc, cur) => {
        return acc + parseFloat(cur.EXPENSE_AMOUNT)
      }, 0)

      promises.push(
        pgClient.query(
          'INSERT INTO "salesReporting".sales_contra_lines (invoice_num, invoice_line, othp_code, othp_gl, othp_amount) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (invoice_num, invoice_line, othp_code) DO UPDATE SET invoice_num = $1, invoice_line = $2, othp_code = $3, othp_gl = $4, othp_amount = $5',
          [
            data_unflat[key][0].INVOICE_NUMBER,
            data_unflat[key][0].INVOICE_LINE_NUMBER,
            data_unflat[key][0].EXPENSE_CODE,
            data_unflat[key][0].contra,
            netExpense,
          ]
        )
      )

      i++
    }

    const responses = await Promise.all(promises)

    let rowsUpdatedCount = 0

    responses.forEach(res => {
      rowsUpdatedCount += res.rowCount
    })

    console.log(`upserted ${rowsUpdatedCount} rows to postgres`)

    await pgClient.end()

    return true
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = upsertInvAllocData
