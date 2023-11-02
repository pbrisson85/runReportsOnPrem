const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesByFyYtd = async (config, start, end, showYtd, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: (getSalesTrendByFyYtd Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        sl.fiscal_year ${showYtd ? sql`|| '_ytd' ` : sql``} AS column, 
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
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
        ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
        ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
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
        ${showYtd ? sql`AND sl.week >= ${start} AND sl.week <= ${end}` : sql``} 
      
      GROUP BY 
        sl.fiscal_year, 
        ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)}`: sql``} 
        ${trendQuery.sl.l2_label ? sql`, ${sql(trendQuery.sl.l2_label)}`: sql``} 
        ${trendQuery.sl.l3_label ? sql`, ${sql(trendQuery.sl.l3_label)}`: sql``} 
        ${trendQuery.sl.l4_label ? sql`, ${sql(trendQuery.sl.l4_label)}`: sql``} 
        ${trendQuery.sl.l5_label ? sql`, ${sql(trendQuery.sl.l5_label)}`: sql``} 
        ${trendQuery.sl.l6_label ? sql`, ${sql(trendQuery.sl.l6_label)}`: sql``} 
        ${trendQuery.sl.l7_label ? sql`, ${sql(trendQuery.sl.l7_label)}`: sql``}  
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesByFyYtd = async (config, start, end, showYtd) => {
  try {
    console.log(`${config.user} - level 0: (getSalesTrendByFyYtd Lvl3) query postgres to get FG sales data by week ...`)

    const response = await sql
      `SELECT 
        sl.fiscal_year ${showYtd ? sql`|| '_ytd' ` : sql``} AS column
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
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``}
        ${config.species ? sql`AND ms.species = ${config.species}`: sql``}
        ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}
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
        ${showYtd ? sql`AND sl.week >= ${start} AND sl.week <= ${end}` : sql``} 
      
      GROUP BY sl.fiscal_year 
      
      ORDER BY sl.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesByFyYtd = l0_getSalesByFyYtd
module.exports.l1_getSalesByFyYtd = l1_getSalesByFyYtd