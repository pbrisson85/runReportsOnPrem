const sql = require('../../../../server')

const l1_getProductionTrend = async (config, trendQuery) => {
  if (!trendQuery.wo.l1_label) return []

  try {
    console.log(`${config.user} - level 1: query postgres for wo on hand (l1_getProductionTrend) ...`)

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
      ${sql(config.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column, 
      ${trendQuery.wo.l1_label ? sql`COALESCE(${sql(trendQuery.wo.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
      ${trendQuery.wo.l2_label ? sql`COALESCE(${sql(trendQuery.wo.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
      ${trendQuery.wo.l3_label ? sql`COALESCE(${sql(trendQuery.wo.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
      ${trendQuery.wo.l4_label ? sql`COALESCE(${sql(trendQuery.wo.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
      ${trendQuery.wo.l5_label ? sql`COALESCE(${sql(trendQuery.wo.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
      ${trendQuery.wo.l6_label ? sql`COALESCE(${sql(trendQuery.wo.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
      ${trendQuery.wo.l7_label ? sql`COALESCE(${sql(trendQuery.wo.l7_label)},'NO VALUE') AS l7_label,`: sql``}
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost,
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb"
      
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
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
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
        ${sql(config.trends.queryGrouping)}, 
        ${trendQuery.wo.l1_label ? sql`${sql(trendQuery.wo.l1_label)}`: sql``} 
        ${trendQuery.wo.l2_label ? sql`, ${sql(trendQuery.wo.l2_label)}`: sql``} 
        ${trendQuery.wo.l3_label ? sql`, ${sql(trendQuery.wo.l3_label)}`: sql``} 
        ${trendQuery.wo.l4_label ? sql`, ${sql(trendQuery.wo.l4_label)}`: sql``} 
        ${trendQuery.wo.l5_label ? sql`, ${sql(trendQuery.wo.l5_label)}`: sql``} 
        ${trendQuery.wo.l6_label ? sql`, ${sql(trendQuery.wo.l6_label)}`: sql``} 
        ${trendQuery.wo.l7_label ? sql`, ${sql(trendQuery.wo.l7_label)}`: sql``}
      
      ORDER BY ${sql(config.trends.queryGrouping)} ASC
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
    console.log(`${config.user} - level 0: query postgres for wo on hand (l0_getProductionTrend) ...`)

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
      ${sql(config.trends.queryGrouping)} || ${sql`REPLACE('_${sql(woActivity)}','"', '')`} AS column,  
      'TOTAL' AS l1_label, 
      COALESCE(SUM(wo.fg_line_weight),0) AS lbs, 
      COALESCE(SUM(wo.fg_line_extended_cost),0) AS cost, 
      COALESCE(SUM(wo.fg_line_extended_cost)/NULLIF(SUM(wo.fg_line_weight),0),0) AS "costPerLb"
      
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
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.trends.startDate} 
              AND p.formatted_date <= ${config.trends.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
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

    GROUP BY ${sql(config.trends.queryGrouping)}

      ORDER BY ${sql(config.trends.queryGrouping)} ASC
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
}
