const sql = require('../../../../server')

const l1_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data by week (l1_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data by week (l2_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    console.log('response', response)

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data by week (l3_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data by week (l4_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesTrend = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data by week (l0_getSalesTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(sl.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sl.gross_sales_ext),0) AS sales, COALESCE(SUM(sl.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sl.othp_ext),0) AS othp 
      
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
      
      WHERE 
        sl.formatted_invoice_date >= ${config.trends.startDate} AND sl.formatted_invoice_date <= ${config.trends.endDate} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.trends.queryGrouping)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l0_getSalesTrend = l0_getSalesTrend
module.exports.l1_getSalesTrend = l1_getSalesTrend
module.exports.l2_getSalesTrend = l2_getSalesTrend
module.exports.l3_getSalesTrend = l3_getSalesTrend
module.exports.l4_getSalesTrend = l4_getSalesTrend
module.exports.l5_getSalesTrend = l5_getSalesTrend
