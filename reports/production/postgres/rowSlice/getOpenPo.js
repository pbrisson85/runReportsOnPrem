const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getOpenPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO ...`)

    if (!trendQuery.po.l1_label) return []

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
            AND act.wo_group IN ${sql(config.baseFilters.wo.woActivities)}
            AND p.formatted_date >= ${config.dates.totals.primary.startDate} AND p.formatted_date <= ${config.dates.totals.primary.endDate}
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 
            ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
            ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
            ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
            ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
            ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` }  
            ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
        )
        
        SELECT 
          'PURCHASE ORDER' AS column, 
          ${trendQuery.po.l1_label ? sql`COALESCE(${sql(trendQuery.po.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.po.l2_label ? sql`COALESCE(${sql(trendQuery.po.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.po.l3_label ? sql`COALESCE(${sql(trendQuery.po.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.po.l4_label ? sql`COALESCE(${sql(trendQuery.po.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.po.l5_label ? sql`COALESCE(${sql(trendQuery.po.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.po.l6_label ? sql`COALESCE(${sql(trendQuery.po.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.po.l7_label ? sql`COALESCE(${sql(trendQuery.po.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cost, 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "costPerLb"
         
        FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
        WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory)
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}   
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          AND inv.item_number IN (SELECT item_number FROM wo_filters) -- apply wo filters (only show items with WO's)
          ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
          ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
          ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
          ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
          ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` }  
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }

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

const l0_getOpenPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 
          'PURCHASE ORDER' AS column,
          'TOTAL' AS l1_label,  
          COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(inv.on_order_extended),0) AS cost, 
          COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "costPerLb"
         
         FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``}
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
          ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
          ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
          ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
          ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` }  
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l1_getOpenPo = l1_getOpenPo
module.exports.l0_getOpenPo = l0_getOpenPo
