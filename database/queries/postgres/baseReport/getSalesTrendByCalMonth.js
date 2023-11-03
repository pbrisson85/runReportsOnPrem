const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesByCalMo = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesByCalMo) ...`)

    const response = await sql
      `SELECT EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date), ${sql(config.l1_field)} 
      
      ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const l1_getSalesCalMoToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesCalMoToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL CAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 Group *********************************************** */

// FG Program row totals by week

const l2_getSalesByCalMo = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesByCalMo) ...`)

    const response = await sql
      `SELECT EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date), ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l2_getSalesCalMoToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesCalMoToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL CAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 Group *********************************************** */

// FG Program row totals by week

const l3_getSalesByCalMo = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesByCalMo) ...`)

    const response = await sql
      `SELECT EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date), ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l3_getSalesCalMoToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesCalMoToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL CAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 Group *********************************************** */

// FG Program row totals by week

const l4_getSalesByCalMo = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByCalMo) ...`)

    const response = await sql
      `SELECT EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date), ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l4_getSalesCalMoToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesCalMoToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL CAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesByCalMo = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesByCalMo) ...`)

    const response = await sql
      `SELECT EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) 
      
      ORDER BY EXTRACT('MONTH' FROM sales_line_items.formatted_invoice_date) ASC` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const l0_getSalesCalMoToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesCalMoToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL CAL' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_line_items.item_number 
      
      WHERE 
        sales_line_items.formatted_invoice_date >= '01-01-2023' AND sales_line_items.formatted_invoice_date <= '11-30-2023' 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesByCalMo = l0_getSalesByCalMo
module.exports.l0_getSalesCalMoToDate = l0_getSalesCalMoToDate
module.exports.l2_getSalesByCalMo = l2_getSalesByCalMo
module.exports.l2_getSalesCalMoToDate = l2_getSalesCalMoToDate
module.exports.l1_getSalesByCalMo = l1_getSalesByCalMo
module.exports.l1_getSalesCalMoToDate = l1_getSalesCalMoToDate
module.exports.l3_getSalesByCalMo = l3_getSalesByCalMo
module.exports.l3_getSalesCalMoToDate = l3_getSalesCalMoToDate
module.exports.l4_getSalesByCalMo = l4_getSalesByCalMo
module.exports.l4_getSalesCalMoToDate = l4_getSalesCalMoToDate
