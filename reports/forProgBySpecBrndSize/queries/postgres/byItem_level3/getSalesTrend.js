/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (config, start, end, program, filters) => {
  try {
    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sales_line_items.week_serial AS column, ms.item_num AS l1_label, ms.description AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]} 
      
      GROUP BY sales_line_items.week_serial, ms.item_num, ms.description 
      
      ORDER BY sales_line_items.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const lvl_1_subtotal_getSalesPeriodToDate = async (config, start, end, program, filters) => {
  try {
    console.log(`level 1: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, ms.item_num AS l1_label, ms.description AS l2_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]} 
      
      GROUP BY ms.item_num, ms.description` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByWk = async (config, start, end, program, filters) => {
  try {
    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sales_line_items.week_serial AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]} 
      
      GROUP BY sales_line_items.week_serial 
      
      ORDER BY sales_line_items.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const lvl_0_total_getSalesPeriodToDate = async (config, start, end, program, filters) => {
  try {
    console.log(`level 0: query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND ms.size_name = ${filters[2]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByWk = lvl_0_total_getSalesByWk
module.exports.lvl_0_total_getSalesPeriodToDate = lvl_0_total_getSalesPeriodToDate
module.exports.lvl_1_subtotal_getSalesByWk = lvl_1_subtotal_getSalesByWk
module.exports.lvl_1_subtotal_getSalesPeriodToDate = lvl_1_subtotal_getSalesPeriodToDate
