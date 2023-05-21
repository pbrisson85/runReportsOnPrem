const getWklyBpByType = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT sales_line_items.week_serial AS week_serial, \'BP\' AS maj_row, master_supplement.byproduct_type AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NOT NULL GROUP BY sales_line_items.week_serial, master_supplement.byproduct_type ORDER BY sales_line_items.week_serial, master_supplement.byproduct_type',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const getWklyBpByTypeTotalCol = async (program, start, end) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres to get weekly purchses for ${program} ...`)

    const response = await pgClient.query(
      'SELECT \'TOTAL\' AS week_serial, \'BP\' AS maj_row, master_supplement.byproduct_type AS min_row, SUM(sales_line_items.calc_gm_rept_weight) AS lbs, SUM(sales_line_items.calc_gl_gross_sales) AS sales, SUM(sales_line_items.calc_gl_cogs) AS cogs, SUM(sales_line_items.calc_gl_othp) AS othp FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_line_items.item_number WHERE master_supplement.item_type = $1 AND master_supplement.program = $2 AND sales_line_items.formatted_invoice_date >= $3 AND sales_line_items.formatted_invoice_date <= $4 AND master_supplement.byproduct_type IS NOT NULL GROUP BY master_supplement.byproduct_type ORDER BY master_supplement.byproduct_type',
      ['FG', program, start, end]
    )

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports, (getWklyBpByType = getWklyBpByType)
module.exports, (getWklyBpByTypeTotalCol = getWklyBpByTypeTotalCol)
