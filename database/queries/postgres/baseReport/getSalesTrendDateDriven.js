const sql = require('../../../../server')

/* *********************************************** Level 1 Group *********************************************** */

// FG Species Group totals by week

const l1_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesByFiscalPeriod) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial, ${sql(config.l1_field)} 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Species Group col total for period

const l1_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
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

const l2_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l2_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
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

const l3_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l3_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
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

const l4_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l4_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
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

/* *********************************************** Level 5 Group *********************************************** */

// FG Program row totals by week

const l5_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG Program col total for period

const l5_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Totals *********************************************** */

// All sales row totals by week for a program

const l0_getSalesByWk = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.week_serial AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.week_serial 
      
      ORDER BY sl.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesByFiscalPeriod = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesByWk) ...`)

    const response = await sql
      `SELECT sl.period_serial AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY sl.period_serial 
      
      ORDER BY sl.period_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// All sales col total for a program

const l0_getSalesPeriodToDate = async (config, start, end) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesPeriodToDate) ...`)

    const response = await sql
      `SELECT 'SALES TOTAL' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesPeriodToDate = l0_getSalesPeriodToDate
module.exports.l1_getSalesPeriodToDate = l1_getSalesPeriodToDate
module.exports.l2_getSalesPeriodToDate = l2_getSalesPeriodToDate
module.exports.l3_getSalesPeriodToDate = l3_getSalesPeriodToDate
module.exports.l4_getSalesPeriodToDate = l4_getSalesPeriodToDate
module.exports.l5_getSalesPeriodToDate = l5_getSalesPeriodToDate

module.exports.l0_getSalesByWk = l0_getSalesByWk
module.exports.l1_getSalesByWk = l1_getSalesByWk
module.exports.l2_getSalesByWk = l2_getSalesByWk
module.exports.l3_getSalesByWk = l3_getSalesByWk
module.exports.l4_getSalesByWk = l4_getSalesByWk
module.exports.l5_getSalesByWk = l5_getSalesByWk

module.exports.l0_getSalesByFiscalPeriod = l0_getSalesByFiscalPeriod
module.exports.l1_getSalesByFiscalPeriod = l1_getSalesByFiscalPeriod
module.exports.l2_getSalesByFiscalPeriod = l2_getSalesByFiscalPeriod
module.exports.l3_getSalesByFiscalPeriod = l3_getSalesByFiscalPeriod
module.exports.l4_getSalesByFiscalPeriod = l4_getSalesByFiscalPeriod
module.exports.l5_getSalesByFiscalPeriod = l5_getSalesByFiscalPeriod
