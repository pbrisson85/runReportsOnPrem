const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo = async config => {
  //${config.jbBuyer ? sql`AND inv.item_number IN SELECT(DISTINCT(perpetual_inventory.item_number FROM ))` : sql``}
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO (lvl_1_subtotal_getFgPo) ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
        
         FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
         
         WHERE 
          ms.item_type = ${'FG'} 
          AND inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.program ? sql`AND ms.program = ${config.program}` : sql``} 
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
         
         GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_2_subtotal_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for FG open PO (lvl_2_subtotal_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        ms.item_type = ${'FG'} 
        AND inv.on_order_lbs <> 0 
        AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.program ? sql`AND ms.program = ${config.program}` : sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_3_subtotal_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG open PO (lvl_3_subtotal_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        ms.item_type = ${'FG'} 
        AND inv.on_order_lbs <> 0 
        AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_4_subtotal_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG open PO (lvl_4_subtotal_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        ms.item_type = ${'FG'} 
        AND inv.on_order_lbs <> 0 
        AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO (lvl_0_total_getFgPo) ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
         
         WHERE 
          ms.item_type = ${'FG'} 
          AND inv.on_order_lbs <> 0 
          AND inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo = lvl_1_subtotal_getFgPo
module.exports.lvl_2_subtotal_getFgPo = lvl_2_subtotal_getFgPo
module.exports.lvl_3_subtotal_getFgPo = lvl_3_subtotal_getFgPo
module.exports.lvl_4_subtotal_getFgPo = lvl_4_subtotal_getFgPo
module.exports.lvl_0_total_getFgPo = lvl_0_total_getFgPo
