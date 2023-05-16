// Schedule
const getWklySalesByProg = async (program, fy) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS week_serial, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp, \'total\' AS min_row, $1 AS maj_row FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.program = $1 AND sales_line_items.fiscal_year = $2 GROUP BY sales_line_items.week_serial, maj_row ORDER BY sales_line_items.week_serial',
      [program, fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWklySalesByProg
