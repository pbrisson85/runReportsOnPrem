const sql = require('../../../../server')

const l1_getProduction = async (config, trendQuery) => {
  if (!trendQuery.wo.l1_label) return []
  if (config.trends.yearTrend) return [] // skip totals if trend is by year

  console.log('config.baseFilters.productionCountries', config.baseFilters.productionCountries)

  try {
    console.log(`${config.user} - level 1: query postgres for wo on hand (l1_getProduction) ...`)

    // level 1 detail

    const eachWoActivity = []

    for (woActivity of config.baseFilters.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column, 
      ${trendQuery.wo.l1_label ? sql`COALESCE(${sql(trendQuery.wo.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
      ${trendQuery.wo.l2_label ? sql`COALESCE(${sql(trendQuery.wo.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
      ${trendQuery.wo.l3_label ? sql`COALESCE(${sql(trendQuery.wo.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
      ${trendQuery.wo.l4_label ? sql`COALESCE(${sql(trendQuery.wo.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
      ${trendQuery.wo.l5_label ? sql`COALESCE(${sql(trendQuery.wo.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
      ${trendQuery.wo.l6_label ? sql`COALESCE(${sql(trendQuery.wo.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
      ${trendQuery.wo.l7_label ? sql`COALESCE(${sql(trendQuery.wo.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
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
        ${config.baseFilters.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.productionCountries)}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}

      GROUP BY 
      ${trendQuery.wo.l1_label ? sql`${sql(trendQuery.wo.l1_label)}`: sql``} 
      ${trendQuery.wo.l2_label ? sql`, ${sql(trendQuery.wo.l2_label)}`: sql``} 
      ${trendQuery.wo.l3_label ? sql`, ${sql(trendQuery.wo.l3_label)}`: sql``} 
      ${trendQuery.wo.l4_label ? sql`, ${sql(trendQuery.wo.l4_label)}`: sql``} 
      ${trendQuery.wo.l5_label ? sql`, ${sql(trendQuery.wo.l5_label)}`: sql``} 
      ${trendQuery.wo.l6_label ? sql`, ${sql(trendQuery.wo.l6_label)}`: sql``} 
      ${trendQuery.wo.l7_label ? sql`, ${sql(trendQuery.wo.l7_label)}`: sql``}
      ` //prettier-ignore

      eachWoActivity.push(...response)
    }

    return eachWoActivity
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getProduction = async config => {
  if (config.trends.yearTrend) return [] // skip totals if trend is by year

  try {
    console.log(`${config.user} - level 0: query postgres for wo on hand (l0_getProduction) ...`)

    // level 0 detail (TOTAL)

    const eachWoActivity = []

    for (woActivity of config.baseFilters.woActivities) {
      const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      ${woActivity} AS column,  
      'TOTAL' AS l1_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.rm_fg_line_weight),0) AS rm_lbs,
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
        ${config.baseFilters.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.productionCountries)}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
    
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
}
