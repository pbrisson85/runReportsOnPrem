const sql = require('../../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group col total for period

// SINCE I AM NOT USING A YEAR AS A FILTER I AM GETTING ALLLLLLLLLLL YEARS FUCKING MOMO

const l1_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk}
        AND sl.fiscal_year = ${year} 
        AND ms.byproduct_type IS NULL 
        ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
        ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
        AND ms.item_type = ${'FG'} 
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

// FG Program col total for period

const l2_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        AND ms.byproduct_type IS NULL 
        ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
        ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
        AND ms.item_type = ${'FG'} 
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

// FG Program col total for period

const l3_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        AND ms.byproduct_type IS NULL 
        ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
        ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
        AND ms.item_type = ${'FG'} 
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

// FG Program col total for period

const l4_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        AND ms.byproduct_type IS NULL 
        ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
        ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
        AND ms.item_type = ${'FG'} 
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

// All sales col total for a program

const l0_getSalesWkDriven = async (config, startWk, endWk, year) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesWkDriven) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.week >= ${startWk} AND sl.week <= ${endWk} 
        AND sl.fiscal_year = ${year} 
        AND ms.byproduct_type IS NULL 
        ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
        ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
        AND ms.item_type = ${'FG'} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesWkDriven = l0_getSalesWkDriven
module.exports.l2_getSalesWkDriven = l2_getSalesWkDriven
module.exports.l1_getSalesWkDriven = l1_getSalesWkDriven
module.exports.l3_getSalesWkDriven = l3_getSalesWkDriven
module.exports.l4_getSalesWkDriven = l4_getSalesWkDriven
