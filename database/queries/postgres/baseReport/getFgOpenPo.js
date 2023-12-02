const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getFgPo = async config => {
  //${config.jbBuyer ? sql`AND inv.item_number IN SELECT(DISTINCT(perpetual_inventory.item_number FROM ))` : sql``}
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO (l1_getFgPo) ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
        
         FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          AND inv.on_order_lbs <> 0 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.program ? sql`AND ms.program = ${config.program}` : sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
         
         GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l2_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for FG open PO (l2_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}` : sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l3_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG open PO (l3_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l4_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG open PO (l4_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l5_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG open PO (l4_getFgPo) ...`)

    const response = await sql
       `SELECT 'FG ON ORDER' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
       
       FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getFgPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO (l0_getFgPo) ...`)

    const response = await sql
         `SELECT 'FG ON ORDER' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(inv.on_order_lbs),0) AS lbs, COALESCE(SUM(inv.on_order_extended),0) AS cogs 
         
         FROM "invenReporting".perpetual_inventory AS inv LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          AND inv.on_order_lbs <> 0 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l1_getFgPo = l1_getFgPo
module.exports.l2_getFgPo = l2_getFgPo
module.exports.l3_getFgPo = l3_getFgPo
module.exports.l4_getFgPo = l4_getFgPo
module.exports.l5_getFgPo = l5_getFgPo
module.exports.l0_getFgPo = l0_getFgPo
