const sql = require('../../../../server')

const l1_getReceivedPo = async (config, trendQuery) => {
  if (!trendQuery.po.l1_label) return []

  //${config.jbBuyer ? sql`AND po.item_number IN SELECT(DISTINCT(perpetual_inventory.item_number FROM ))` : sql``}
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO (l1_getReceivedPo) ...`)

    const response = await sql
         `
         WITH wo_activity AS (
          SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group, ms2.program_country 
          FROM "invenReporting".master_supplement AS ms2 
          WHERE item_type = 'WO_ACTIVITY'
        ),
        wo_filters AS (
          SELECT 
            wo.fg_line_item AS item_number
          FROM "woReporting".wo_detail_by_fg AS wo
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = wo.fg_line_item 
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON wo.formatted_posting_date = p.formatted_date
            LEFT OUTER JOIN wo_activity AS act 
                ON act.item_num = wo.wo_activity_code
          WHERE 
            wo.by_prod_fg_line_bool = false
            AND act.wo_group IN ${sql(config.baseFilters.woActivities)}
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
        )

         SELECT 
         'PURCHASE RECEIPTS' AS column, 
         ${trendQuery.po.l1_label ? sql`COALESCE(${sql(trendQuery.po.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
         ${trendQuery.po.l2_label ? sql`COALESCE(${sql(trendQuery.po.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
         ${trendQuery.po.l3_label ? sql`COALESCE(${sql(trendQuery.po.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
         ${trendQuery.po.l4_label ? sql`COALESCE(${sql(trendQuery.po.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
         ${trendQuery.po.l5_label ? sql`COALESCE(${sql(trendQuery.po.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
         ${trendQuery.po.l6_label ? sql`COALESCE(${sql(trendQuery.po.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
         ${trendQuery.po.l7_label ? sql`COALESCE(${sql(trendQuery.po.l7_label)},'NO VALUE') AS l7_label,`: sql``}  
         COALESCE(SUM(po.weight),0) AS lbs, 
         COALESCE(SUM(po.extended_cost),0) AS cost, 
         COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
        
         FROM "purchaseReporting".po_data AS po 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = po.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
         
         WHERE 
          po.po_offset = FALSE
          AND po.extended_cost <> 0 
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
            ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
            ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
            ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
            ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
            AND po.item_number IN (SELECT item_number FROM wo_filters) -- apply wo filters (only show items with WO's)

         GROUP BY 
          ${trendQuery.po.l1_label ? sql`${sql(trendQuery.po.l1_label)}`: sql``} 
          ${trendQuery.po.l2_label ? sql`, ${sql(trendQuery.po.l2_label)}`: sql``} 
          ${trendQuery.po.l3_label ? sql`, ${sql(trendQuery.po.l3_label)}`: sql``} 
          ${trendQuery.po.l4_label ? sql`, ${sql(trendQuery.po.l4_label)}`: sql``} 
          ${trendQuery.po.l5_label ? sql`, ${sql(trendQuery.po.l5_label)}`: sql``} 
          ${trendQuery.po.l6_label ? sql`, ${sql(trendQuery.po.l6_label)}`: sql``} 
          ${trendQuery.po.l7_label ? sql`, ${sql(trendQuery.po.l7_label)}`: sql``}
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getReceivedPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO (l0_getReceivedPo) ...`)

    const response = await sql
         `SELECT 
         'PURCHASE RECEIPTS' AS column, 
         'TOTAL' AS l1_label,
         COALESCE(SUM(po.weight),0) AS lbs, 
         COALESCE(SUM(po.extended_cost),0) AS cost, 
         COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
         
         FROM "purchaseReporting".po_data AS po 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = po.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
         
         WHERE 
          po.po_offset = FALSE
          AND po.extended_cost <> 0 
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
            ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
            ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
            ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
            ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
            
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l1_getReceivedPo, l0_getReceivedPo }
