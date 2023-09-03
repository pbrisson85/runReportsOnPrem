const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO ...`)

    const response = await sql
        `SELECT 
          'FG ON ORDER' AS column, 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.l2_label ? sql`${sql(trendQuery.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.l3_label ? sql`${sql(trendQuery.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.l4_label ? sql`${sql(trendQuery.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.l5_label ? sql`${sql(trendQuery.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.l6_label ? sql`${sql(trendQuery.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.l7_label ? sql`${sql(trendQuery.l7_label)} AS l7_label,`: sql``} 
          COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, 
          COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
        FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
        WHERE 
          ms.item_type = ${'FG'} 
          AND perpetual_inventory.on_order_lbs <> 0 
          AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
          ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
          ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
          ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
         
        GROUP BY 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)}`: sql``} 
          ${trendQuery.l2_label ? sql`, ${sql(trendQuery.l2_label)}`: sql``} 
          ${trendQuery.l3_label ? sql`, ${sql(trendQuery.l3_label)}`: sql``} 
          ${trendQuery.l4_label ? sql`, ${sql(trendQuery.l4_label)}`: sql``} 
          ${trendQuery.l5_label ? sql`, ${sql(trendQuery.l5_label)}`: sql``} 
          ${trendQuery.l6_label ? sql`, ${sql(trendQuery.l6_label)}`: sql``} 
          ${trendQuery.l7_label ? sql`, ${sql(trendQuery.l7_label)}`: sql``} 
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, 'FG SALES' AS l1_label, COALESCE(SUM(perpetual_inventory.on_order_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
         
         WHERE 
          ms.item_type = ${'FG'} 
          AND perpetual_inventory.on_order_lbs <> 0 
          AND perpetual_inventory.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
          ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
          ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
          ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo
