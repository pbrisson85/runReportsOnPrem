const sql = require('../../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByFyYtd = async (config, start, end, program, filters, showYtd) => {
  try {
    console.log(`level 1: (getSalesTrendByFyYtd Lvl2) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sl.fiscal_year ${showYtd ? sql`|| '_ytd' ` : sql``} AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.fg_fresh_frozen AS l3_label, ms.fg_treatment AS l4_label, ms.brand AS l5_label, ms.size_name AS l6_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} ${filters[3] ? sql`AND sl.customer_code = ${filters[3]}`: sql``} ${showYtd ? sql`AND sl.week >= ${start} AND sl.week <= ${end}` : sql``} 
      
      GROUP BY sl.fiscal_year, ms.item_num, ms.description, ms.fg_fresh_frozen, ms.fg_treatment, ms.brand, ms.size_name 
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByFyYtd = async (config, start, end, program, filters, showYtd) => {
  try {
    console.log(`level 0: (getSalesTrendByFyYtd Lvl2) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT sl.fiscal_year ${showYtd ? sql`|| '_ytd' ` : sql``} AS column, 'FG SALES' AS l1_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} ${filters[3] ? sql`AND sl.customer_code = ${filters[3]}`: sql``} ${showYtd ? sql`AND sl.week >= ${start} AND sl.week <= ${end}` : sql``} 
          
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
