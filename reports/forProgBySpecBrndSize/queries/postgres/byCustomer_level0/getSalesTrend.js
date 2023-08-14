const sql = require('../../../../../server')
/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (config, start, end, program, filters) => {
  try {
    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, sl.customer_code AS l1_label, sl.customer_name AS l2_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
      
      GROUP BY sl.week_serial, sl.customer_code, sl.customer_name
      
      ORDER BY sl.week_serial` //prettier-ignore

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
      `SELECT \'SALES TOTAL\' AS column, sl.customer_code AS l1_label, sl.customer_name AS l2_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
      
      GROUP BY sl.customer_code, sl.customer_name` //prettier-ignore

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
      `SELECT sl.week_serial AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
      
      GROUP BY sl.week_serial 
      
      ORDER BY sl.week_serial` //prettier-ignore

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
      `SELECT \'SALES TOTAL\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program}` //prettier-ignore

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
