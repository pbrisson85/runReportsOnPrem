const sql = require('../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const lvl_1_subtotal_getSalesByWk = async (config, start, end, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrend Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        sl.week_serial AS column, 
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
        ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
        ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
        ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
        ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
        ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
        ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``}
        COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, 
        COALESCE(SUM(sl.gross_sales_ext),0) AS sales, 
        COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, 
        COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        AND ms.byproduct_type IS NULL 
        AND ms.item_type = ${'FG'} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
      GROUP BY 
        sl.week_serial, 
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)}`: sql``} 
        ${trendQuery.sl.l2_label ? sql`, ${sql(trendQuery.sl.l2_label)}`: sql``} 
        ${trendQuery.sl.l3_label ? sql`, ${sql(trendQuery.sl.l3_label)}`: sql``} 
        ${trendQuery.sl.l4_label ? sql`, ${sql(trendQuery.sl.l4_label)}`: sql``} 
        ${trendQuery.sl.l5_label ? sql`, ${sql(trendQuery.sl.l5_label)}`: sql``} 
        ${trendQuery.sl.l6_label ? sql`, ${sql(trendQuery.sl.l6_label)}`: sql``} 
        ${trendQuery.sl.l7_label ? sql`, ${sql(trendQuery.sl.l7_label)}`: sql``} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const lvl_1_subtotal_getSalesPeriodToDate = async (config, start, end, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrend Lvl3) query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
        ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
        ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
        ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
        ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
        ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
        ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``}
        COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, 
        COALESCE(SUM(sl.gross_sales_ext),0) AS sales, 
        COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, 
        COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        AND ms.byproduct_type IS NULL 
        AND ms.item_type = ${'FG'} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
      GROUP BY 
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)}`: sql``} 
        ${trendQuery.sl.l2_label ? sql`, ${sql(trendQuery.sl.l2_label)}`: sql``} 
        ${trendQuery.sl.l3_label ? sql`, ${sql(trendQuery.sl.l3_label)}`: sql``} 
        ${trendQuery.sl.l4_label ? sql`, ${sql(trendQuery.sl.l4_label)}`: sql``} 
        ${trendQuery.sl.l5_label ? sql`, ${sql(trendQuery.sl.l5_label)}`: sql``} 
        ${trendQuery.sl.l6_label ? sql`, ${sql(trendQuery.sl.l6_label)}`: sql``} 
        ${trendQuery.sl.l7_label ? sql`, ${sql(trendQuery.sl.l7_label)}`: sql``}
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const lvl_0_total_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: (getSalesTrend Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        sl.week_serial AS column, 
        'FG SALES' AS l1_label, 
'TOTAL' AS l2_label,  
        COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, 
        COALESCE(SUM(sl.gross_sales_ext),0) AS sales, 
        COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, 
        COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        AND ms.byproduct_type IS NULL 
        AND ms.item_type = ${'FG'} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
      
      GROUP BY sl.week_serial 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const lvl_0_total_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: (getSalesTrend Lvl3) query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        'FG SALES' AS l1_label, 
        'TOTAL' AS l2_label,  
        COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, 
        COALESCE(SUM(sl.gross_sales_ext),0) AS sales, 
        COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, 
        COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        AND ms.byproduct_type IS NULL 
        AND ms.item_type = ${'FG'} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
        ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        ` //prettier-ignore

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