const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 1: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l1_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql` AND sl.week <= ${config.trends.endWeek}` : sql``}
        AND p.fiscal_year IN [2022, 2023]
      
      GROUP BY p.fiscal_year, ${sql(config.l1_field)} 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program row totals by week

const l2_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 2: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l2_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
      ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql`AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``} 
      
      GROUP BY p.fiscal_year, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

// FG Program row totals by week

const l3_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 3: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l3_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql`AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``} 
      
      GROUP BY p.fiscal_year, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 Group *********************************************** */

// FG Program row totals by week

const l4_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 4: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l4_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql`AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``} 
      
      GROUP BY p.fiscal_year, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 5 Group *********************************************** */

// FG Program row totals by week

const l5_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 5: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l4_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql`AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``} 
      
      GROUP BY p.fiscal_year, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesByFyYtd = async config => {
  try {
    console.log(
      `${config.user} - level 0: query postgres to get FG sales data by week for week ${1} through week ${
        config.trends.endWeek
      } (l0_getSalesByFyYtd) ...`
    )

    const response = await sql
      `SELECT p.fiscal_year ${config.trends.fyYtd ? sql`|| '_ytd' ` : sql``} AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
          
      WHERE 
        ${config.itemType ? sql`ms.item_type IN ${sql(config.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.trends.fyYtd ? sql`AND sl.week >= ${1} AND sl.week <= ${config.trends.endWeek}` : sql``} 
      
      GROUP BY p.fiscal_year 
      
      ORDER BY p.fiscal_year` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesByFyYtd = l0_getSalesByFyYtd
module.exports.l2_getSalesByFyYtd = l2_getSalesByFyYtd
module.exports.l1_getSalesByFyYtd = l1_getSalesByFyYtd
module.exports.l3_getSalesByFyYtd = l3_getSalesByFyYtd
module.exports.l4_getSalesByFyYtd = l4_getSalesByFyYtd
module.exports.l5_getSalesByFyYtd = l5_getSalesByFyYtd
