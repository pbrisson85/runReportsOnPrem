const sql = require('../../../../server')

const l1_getProduction = async (config, woActivityGroups) => {
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres for Inv on hand (l1_getProduction) ...`)

    // level 1 detail

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost,
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb",
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb", 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb" 
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY 
      ${sql(config.baseFormat.l1_field)}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getProduction = async (config, woActivityGroups) => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for Inv on hand (l2_getProduction) ...`)

    // Level 2 detail

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label,
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb",
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb"
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY 
      ${sql(config.baseFormat.l1_field)}, 
      ${sql(config.baseFormat.l2_field)}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getProduction = async (config, woActivityGroups) => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for Inv on hand (l3_getProduction) ...`)

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb", 
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb"
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getProduction = async (config, woActivityGroups) => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for Inv on hand (l4_getProduction) ...`)

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb",
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb"
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getProduction = async (config, woActivityGroups) => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for Inv on hand (l4_getProduction) ...`)

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb",
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb" 
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}, 
        ${sql(config.baseFormat.l5_field)}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getProduction = async (config, woActivityGroups) => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv on hand (l0_getProduction) ...`)

    // level 0 detail (TOTAL)

    const eachWoActivity = []

    for (woActivity of woActivityGroups) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      'TOTAL' AS l1_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS processingFee, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "laborPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "ohPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "packagingPerLb",
      COALESCE(SUM(wo.chem_fg_line_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "chemPerLb",
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "processingFeePerLb" 
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${config.totals.primary.startDate} AND p.formatted_date <= ${config.totals.primary.endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        
    
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  l0_getProduction,
  l1_getProduction,
  l2_getProduction,
  l3_getProduction,
  l4_getProduction,
  l5_getProduction,
}
