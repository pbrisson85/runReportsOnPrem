/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFyYtd = async (config, start, end, program, filters) => {
  try {
    console.log(`level 1: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sl.fiscal_year || '_ytd' AS column, sl.customer_code AS l1_label, sl.customer_name AS l2_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND sl.week >= ${start} AND sl.week <= ${end}
      
      GROUP BY sl.fiscal_year, sl.customer_code, sl.customer_name
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByFyYtd = async (config, start, end, program, filters) => {
  try {
    console.log(`level 0: query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sl.fiscal_year || '_ytd' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} AND ms.species = ${filters[0]} AND ms.brand = ${filters[1]} AND sl.week >= ${start} AND sl.week <= ${end}
      
      GROUP BY sl.fiscal_year 
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_0_total_getSalesByFyYtd = lvl_0_total_getSalesByFyYtd
module.exports.lvl_1_subtotal_getSalesByFyYtd = lvl_1_subtotal_getSalesByFyYtd
