const sql = require('../../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFy = async (config, start, end, program, filters) => {
  try {
    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sales_line_items.fiscal_year AS column, ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label, ${sql(config.l3_field)} AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ${sql(config.l1_field)} = ${filters[0]}
      
      GROUP BY sales_line_items.fiscal_year, ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sales_line_items.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByFy = async (config, start, end, program, filters) => {
  try {
    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sales_line_items.fiscal_year AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ${sql(config.l1_field)} = ${filters[0]} 
      
      GROUP BY sales_line_items.fiscal_year 
      
      ORDER BY sales_line_items.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFy = lvl_0_total_getSalesByFy
module.exports.lvl_1_subtotal_getSalesByFy = lvl_1_subtotal_getSalesByFy