const sql = require('../../../../server')

const l1_getInv = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG on hand ...`)

    if (!trendQuery.inv.l1_label) return []

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
    )
    
    SELECT 
      'INVEN' AS column, 
      ${trendQuery.inv.l1_label ? sql`COALESCE(${sql(trendQuery.inv.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
      ${trendQuery.inv.l2_label ? sql`COALESCE(${sql(trendQuery.inv.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
      ${trendQuery.inv.l3_label ? sql`COALESCE(${sql(trendQuery.inv.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
      ${trendQuery.inv.l4_label ? sql`COALESCE(${sql(trendQuery.inv.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
      ${trendQuery.inv.l5_label ? sql`COALESCE(${sql(trendQuery.inv.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
      ${trendQuery.inv.l6_label ? sql`COALESCE(${sql(trendQuery.inv.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
      ${trendQuery.inv.l7_label ? sql`COALESCE(${sql(trendQuery.inv.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cost, 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "costPerLb"
      
    FROM "invenReporting".perpetual_inventory AS inv 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
        ON ms.item_num = inv.item_number 
    
    WHERE 
      inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
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
      AND inv.item_number IN (SELECT item_number FROM wo_filters) -- apply wo filters (only show items with WO's)
      
    GROUP BY 
    ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)}`: sql``} 
    ${trendQuery.inv.l2_label ? sql`, ${sql(trendQuery.inv.l2_label)}`: sql``} 
    ${trendQuery.inv.l3_label ? sql`, ${sql(trendQuery.inv.l3_label)}`: sql``} 
    ${trendQuery.inv.l4_label ? sql`, ${sql(trendQuery.inv.l4_label)}`: sql``} 
    ${trendQuery.inv.l5_label ? sql`, ${sql(trendQuery.inv.l5_label)}`: sql``} 
    ${trendQuery.inv.l6_label ? sql`, ${sql(trendQuery.inv.l6_label)}`: sql``} 
    ${trendQuery.inv.l7_label ? sql`, ${sql(trendQuery.inv.l7_label)}`: sql``} 
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getInv = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      'TOTAL' AS l1_label,  
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cost, 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "costPerLb"
      
      FROM "invenReporting".perpetual_inventory AS inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
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

module.exports = { l1_getInv, l0_getInv }
