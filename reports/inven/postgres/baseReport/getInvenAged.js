const sql = require('../../../../server')
const { subMonths, startOfDay, addDays, subDays } = require('date-fns')

/* *********************************************** Level 1 *********************************************** */

// inv on hand (includes in transit)

const l1_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l1_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []
  try {
    console.log(`${config.user} - level 1: query postgres for inv on hand (l1_getInvAged) ...`)

    // level 1 detail

    for (ageBucket of aging) {
      const start = subDays(subMonths(today, ageBucket.start), 1)
      const end = subMonths(today, ageBucket.end)

      console.log('start: ', start)
      console.log('end: ', end)
      console.log('ageBucket: ', ageBucket.displayName)

      const response = await sql
      `SELECT 
        ${ageBucket.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
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
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}
      ` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

// inv on hand (includes in transit)
const l2_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l2_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 2: query postgres for inv on hand (l2_getInvAged) ...`)

    // Level 2 detail

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
       ${ageBucket.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NA') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
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
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

// inv on hand (includes in transit)
const l3_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l3_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 3: query postgres for inv on hand (l3_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
       ${ageBucket.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
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
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l4_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 4: query postgres for inv on hand (l4_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
       ${ageBucket.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
        COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
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
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l5_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 5: query postgres for inv on hand (l4_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
       ${ageBucket.dataName} AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
        COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
        COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, 
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
        LEFT OUTER JOIN "invenReporting".master_supplement 
          AS ms ON ms.item_num = inv.item_number 
      
      WHERE 
        inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 0: query postgres for inv on hand (l0_getInvAged) ...`)

    // level 0 detail (TOTAL)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
       ${ageBucket.dataName} AS column,  
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
        AND inv.receipt_date <= ${end} AND inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

      eachAging.push(...response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l5_getInvAged, l4_getInvAged, l3_getInvAged, l2_getInvAged, l1_getInvAged, l0_getInvAged }
