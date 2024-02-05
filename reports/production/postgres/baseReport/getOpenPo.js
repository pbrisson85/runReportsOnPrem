const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getOpenPo = async config => {
  if (!config.baseFormat.l1_field) return []

  //${config.jbBuyer ? sql`AND inv.item_number IN SELECT(DISTINCT(perpetual_inventory.item_number FROM ))` : sql``}
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO (l1_getOpenPo) ...`)

    const response = await sql
         `SELECT 
         'PURCHASE ORDER' AS column, 
         COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
         'SUBTOTAL' AS l2_label, 
         'SUBTOTAL' AS l3_label, 
         'SUBTOTAL' AS l4_label, 
         'SUBTOTAL' AS l5_label, 
         COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
         COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
         COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
        
         FROM "invenReporting".perpetual_inventory AS inv 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
         
         WHERE 
          inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          AND inv.on_order_lbs <> 0 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}` : sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
         
         GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l2_getOpenPo = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for FG open PO (l2_getOpenPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE ORDER' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       'SUBTOTAL' AS l3_label, 
       'SUBTOTAL' AS l4_label, 
       'SUBTOTAL' AS l5_label, 
       COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
      COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
      COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
       
       FROM "invenReporting".perpetual_inventory AS inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}` : sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l3_getOpenPo = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for FG open PO (l3_getOpenPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE ORDER' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       'SUBTOTAL' AS l4_label, 
       'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
        COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
        COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
       
       FROM "invenReporting".perpetual_inventory AS inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l4_getOpenPo = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for FG open PO (l4_getOpenPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE ORDER' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
       'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
        COALESCE(SUM(inv.on_order_extended),0) AS cogs, 
        COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
       
       FROM "invenReporting".perpetual_inventory AS inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l5_getOpenPo = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for FG open PO (l4_getOpenPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE ORDER' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
       COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
       COALESCE(SUM(inv.on_order_lbs),0) AS lbs, 
        COALESCE(SUM(inv.on_order_extended),0) AS cogs,  
        COALESCE(SUM(inv.on_order_extended)/NULLIF(SUM(inv.on_order_lbs),0),0) AS "cogsPerLb"
       
       FROM "invenReporting".perpetual_inventory AS inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
       
       WHERE 
        inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.on_order_lbs <> 0 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getOpenPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO (l0_getOpenPo) ...`)

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
          inv.version = (SELECT MAX(version) - 1 FROM "invenReporting".perpetual_inventory) 
          AND inv.on_order_lbs <> 0 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l1_getOpenPo, l2_getOpenPo, l3_getOpenPo, l4_getOpenPo, l5_getOpenPo, l0_getOpenPo }
