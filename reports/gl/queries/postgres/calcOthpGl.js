const calcOthpGl = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to RECALC OTHP GL based on the invoice allocations table ...`)

    // level 1 detail

    const response = await pgClient.query(
        'SELECT o.othp_gl, gl.dept, ROUND(CAST(SUM(o.othp_amount) as numeric),2) AS dollars, s.period, i.major_code_name FROM "salesReporting".sales_contra_lines AS o LEFT OUTER JOIN "salesReporting".sales_line_items as s ON o.invoice_num = s.odbc_invoice_number AND o.invoice_line = s.odbc_line_number LEFT OUTER JOIN "invenReporting".master_supplement as i ON i.item_num = s.item_number LEFT OUTER JOIN "salesReporting".maj_code_gl_map as gl ON gl.name = i.major_code_name WHERE s.fiscal_year = $1 GROUP BY o.othp_gl, s.period, i.major_code_name, gl.dept',
        [fy]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = calcOthpGl
