const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

// Inv on hand (includes in transit)

const l1_getInv = async config => {
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres for Inv on hand (l1_getInv) ...`)

    // level 1 detail

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb"
      
      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv on hand (includes in transit)
const l2_getInv = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for Inv on hand (l2_getInv) ...`)

    // Level 2 detail

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label,
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb"

      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
      inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv on hand (includes in transit)
const l3_getInv = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for Inv on hand (l3_getInv) ...`)

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb" 
      
      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
      inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getInv = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for Inv on hand (l4_getInv) ...`)

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb"
      
      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getInv = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for Inv on hand (l4_getInv) ...`)

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb"
      
      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getInv = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv on hand (l0_getInv) ...`)

    // level 0 detail (TOTAL)

    const response = await sql
      `SELECT 
      'INVEN' AS column, 
      'TOTAL' AS l1_label, 
      COALESCE(SUM(inv.on_hand_lbs),0) AS lbs, 
      COALESCE(SUM(inv.cost_extended),0) AS cogs, 
      COALESCE(SUM(inv.cost_extended),0) AS othp, 
      COALESCE(SUM(inv.cost_extended),0) AS "grossSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "netSales", 
      COALESCE(SUM(inv.cost_extended),0) AS "grossMargin", 0 AS "grossMarginPercent", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "cogsPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "othpPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "netSalesPerLb", 
      COALESCE(SUM(inv.cost_extended)/NULLIF(SUM(inv.on_hand_lbs),0),0) AS "grossMarginPerLb"
      
      FROM "invenReporting".perpetual_inventory AS inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getInv, l1_getInv, l2_getInv, l3_getInv, l4_getInv, l5_getInv }
