const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial, ${sql(config.l1_field)} 
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program row totals by week

const l2_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

// FG Program row totals by week

const l3_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

/* *********************************************** Level 4 Group *********************************************** */

// FG Program row totals by week

const l4_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

/* *********************************************** Level 5 Group *********************************************** */

// FG Program row totals by week

const l5_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data by week (l4_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesByFiscalQuarter = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesByFiscalQuarter) ...`)

    const response = await sql
      `SELECT p.quarter_serial AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.quarter_serial  
      
      ORDER BY p.quarter_serial ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesByFiscalQuarter = l0_getSalesByFiscalQuarter
module.exports.l2_getSalesByFiscalQuarter = l2_getSalesByFiscalQuarter
module.exports.l1_getSalesByFiscalQuarter = l1_getSalesByFiscalQuarter
module.exports.l3_getSalesByFiscalQuarter = l3_getSalesByFiscalQuarter
module.exports.l4_getSalesByFiscalQuarter = l4_getSalesByFiscalQuarter
module.exports.l5_getSalesByFiscalQuarter = l5_getSalesByFiscalQuarter
