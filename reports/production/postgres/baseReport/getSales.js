const sql = require('../../../../server')

const l1_getSalesTotalPrimary = async config => {
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getSalesTotalPrimary) ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
        'SUBTOTAL' AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
        SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
        COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
    
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)} ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSalesTotalPrimary = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getSalesTotalPrimary) ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
        SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
        COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
  
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSalesTotalPrimary = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getSalesTotalPrimary) ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
        SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
        COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
    
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSalesTotalPrimary = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getSalesTotalPrimary) ...`)

    const response = await sql
      `SELECT 
        'SALES TOTAL' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
        COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
        SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
        COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
    
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}
        
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSalesTotalPrimary = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getSalesTotalPrimary) ...`)

    const response = await sql
      `SELECT 
      'SALES TOTAL' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
      SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
      COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
    
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSalesTotalPrimary = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getSalesTotalPrimary) ...`)

    const response = await sql
      `
      SELECT 
        'SALES TOTAL' AS column, 
        'TOTAL' AS l1_label,
        SUM(COALESCE(sl.calc_gm_rept_weight,0)) AS lbs, 
        SUM(COALESCE(sl.cogs_ext_gl,0)) AS cost,
        COALESCE(SUM(sl.cogs_ext_gl)/NULLIF(SUM(sl.calc_gm_rept_weight),0),0) AS "costPerLb"
    
      FROM "salesReporting".sales_line_items AS sl 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number
        
      WHERE 
        sl.formatted_invoice_date >= ${config.totals.primary.startDate} AND sl.formatted_invoice_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}    
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  l0_getSalesTotalPrimary,
  l1_getSalesTotalPrimary,
  l2_getSalesTotalPrimary,
  l3_getSalesTotalPrimary,
  l4_getSalesTotalPrimary,
  l5_getSalesTotalPrimary,
}
