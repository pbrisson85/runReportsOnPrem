// Schedule
const getWklySalesByProcLevel = async (program, fy) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS week_serial, sales_line_items.fg_treatment AS row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items WHERE sales_line_items.item_type = $1 AND sales_line_items.program = $2 AND sales_line_items.fiscal_year = $3 AND sales_line_items.byproduct_type IS NULL GROUP BY sales_line_items.week_serial, sales_line_items.fg_treatment ORDER BY sales_line_items.week_serial, sales_line_items.fg_treatment',
      ['FG', program, fy]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWklySalesByProcLevel
