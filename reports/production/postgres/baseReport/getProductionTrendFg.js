const sql = require('../../../../server')

const l1_getProductionTrend = async config => {
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres for Inv on hand (l1_getProductionTrend) ...`)

    // level 1 detail

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost,
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

      GROUP BY 
        ${sql(config.dates.trends.queryGrouping)}, 
        ${sql(config.baseFormat.l1_field)}
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getProductionTrend = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for Inv on hand (l2_getProductionTrend) ...`)

    // Level 2 detail

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label,
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

      GROUP BY 
        ${sql(config.dates.trends.queryGrouping)}, 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getProductionTrend = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for Inv on hand (l3_getProductionTrend) ...`)

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

      GROUP BY 
        ${sql(config.dates.trends.queryGrouping)}, 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getProductionTrend = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for Inv on hand (l4_getProductionTrend) ...`)

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

      GROUP BY 
        ${sql(config.dates.trends.queryGrouping)}, 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getProductionTrend = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for Inv on hand (l4_getProductionTrend) ...`)

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

      GROUP BY 
        ${sql(config.dates.trends.queryGrouping)}, 
        ${sql(config.baseFormat.l1_field)}, 
        ${sql(config.baseFormat.l2_field)}, 
        ${sql(config.baseFormat.l3_field)}, 
        ${sql(config.baseFormat.l4_field)}, 
        ${sql(config.baseFormat.l5_field)}
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getProductionTrend = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv on hand (l0_getProductionTrend) ...`)

    // level 0 detail (TOTAL)

    const eachWoActivity = []

    for (woActivity of config.baseFilters.wo.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${sql(config.dates.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      'TOTAL' AS l1_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
      COALESCE(NULLIF(SUM(wo.fg_line_weight),0)/NULLIF(SUM(wo.rm_fg_line_weight),0),0) AS yield,
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.mfg_fg_line_ext_direct_labor),0) AS labor, 
      COALESCE(SUM(wo.mfg_fg_line_ext_overhead_pool),0) AS oh, 
      COALESCE(SUM(wo.mfg_fg_line_ext_packaging),0) AS packaging, 
      COALESCE(SUM(wo.chem_fg_line_cost),0) AS chem, 
      COALESCE(SUM(wo.mfg_fg_line_ext_processing_fee),0) AS "processingFee", 
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
        ${!config.dates.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.dates.trends.startDate} 
              AND p.formatted_date <= ${config.dates.trends.endDate}` : 
            sql`
              AND ${sql(config.dates.trends.yearTrend.period_name)} >= ${config.dates.trends.yearTrend.start_period} 
              AND ${sql(config.dates.trends.yearTrend.period_name)} <= ${config.dates.trends.yearTrend.end_period} 
              AND ${sql(config.dates.trends.queryGrouping)} IN ${sql(config.dates.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 

    GROUP BY ${sql(config.dates.trends.queryGrouping)}

      ORDER BY ${sql(config.dates.trends.queryGrouping)} ASC
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
  l0_getProductionTrend,
  l1_getProductionTrend,
  l2_getProductionTrend,
  l3_getProductionTrend,
  l4_getProductionTrend,
  l5_getProductionTrend,
}
