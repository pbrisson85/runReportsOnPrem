const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getOpenPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO ...`)

    if (!trendQuery.po.l1_label) return []

    const response = await sql
        `SELECT 
          'PURCHASE ORDER' AS column, 
          ${trendQuery.po.l1_label ? sql`COALESCE(${sql(trendQuery.po.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.po.l2_label ? sql`COALESCE(${sql(trendQuery.po.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.po.l3_label ? sql`COALESCE(${sql(trendQuery.po.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.po.l4_label ? sql`COALESCE(${sql(trendQuery.po.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.po.l5_label ? sql`COALESCE(${sql(trendQuery.po.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.po.l6_label ? sql`COALESCE(${sql(trendQuery.po.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.po.l7_label ? sql`COALESCE(${sql(trendQuery.po.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
         
        FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
        WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
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

/* *********************************************** TOTAL *********************************************** */

const l0_getOpenPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 
          'PURCHASE ORDER' AS column,
          'TOTAL' AS l1_label,  
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
         
         FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
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

module.exports.l1_getOpenPo = l1_getOpenPo
module.exports.l0_getOpenPo = l0_getOpenPo
