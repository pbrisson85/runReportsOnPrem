const sql = require('../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group col total for period

const l1_getSalesWkDriven = async (config, startWk, endWk, trendQuery, year) => {
  try {
    console.log(`${config.user} - level 1: (l1_getSalesWkDriven) query postgres to get FG sales data period total ...`)

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
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        ${config.itemType ? sql`AND ms.item_type IN ${config.itemType}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 
        ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
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

// All sales col total for a program

const l0_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 0: (l0_getSalesWkDriven) query postgres to get FG sales data period total ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column
        ${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 
        'TOTAL' AS l2_label,  
        COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, 
        COALESCE(SUM(sl.gross_sales_ext),0) AS sales, 
        COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, 
        COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        ${config.itemType ? sql`AND ms.item_type IN ${config.itemType}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
        ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
        ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
        ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
        ${config.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.salesPerson}`: sql``} 
        ${config.country ? sql`AND sl.country = ${config.country}`: sql``} 
        ${config.state ? sql`AND sl.state = ${config.state}`: sql``} 
        ${config.export ? sql`AND sl.domestic = ${config.export}`: sql``} 
        ${config.northAmerica ? sql`AND sl.north_america = ${config.northAmerica}`: sql``} 
        ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``}  
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

module.exports.l0_getSalesWkDriven = l0_getSalesWkDriven
module.exports.l1_getSalesWkDriven = l1_getSalesWkDriven
