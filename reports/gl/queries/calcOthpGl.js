const calcOthpGl = async fy => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to RECALC OTHP GL based on the invoice allocations table ...`)

    // level 1 detail

    const response = await pgClient.query(
        'SELECT i.major_code_name, s.period, gl.dept as dept_gl, gl.sales AS sales_gl, gl.cogs AS cogs_gl, ROUND(SUM(s.calc_gl_gross_sales)::numeric,2) AS sales, ROUND(SUM(s.calc_gl_cogs)::numeric,2) AS cogs, ROUND(SUM(s.calc_gm_rept_weight)::numeric,2) AS lbs FROM "salesReporting".sales_line_items AS sLEFT OUTER JOIN "invenReporting".master_supplement as i ON i.item_num = s.item_number LEFT OUTER JOIN "salesReporting".maj_code_gl_map as gl ON gl.name = i.major_code_name WHERE s.fiscal_year = $1 GROUP BY s.period, i.major_code_name, gl.dept, gl.sales, gl.cogs',
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
