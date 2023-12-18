const sql = require('../../../../server')
const { subMonths, startOfDay, addDays } = require('date-fns')

/* *********************************************** Level 1 *********************************************** */

// Inv on hand (includes in transit)

const l1_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l1_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []
  try {
    console.log(`${config.user} - level 1: query postgres for Inv on hand (l1_getInvAged) ...`)

    // level 1 detail

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      console.log('start', start)
      console.log('end', end)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        'SUBTOTAL' AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}
      ` //prettier-ignore

      eachAging.push(...response)

      console.log('eachAging', eachAging)
      console.log('response', response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv on hand (includes in transit)
const l2_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l2_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 2: query postgres for Inv on hand (l2_getInvAged) ...`)

    // Level 2 detail

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'NA') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        'SUBTOTAL' AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

      eachAging.push(response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv on hand (includes in transit)
const l3_getInvAged = async config => {
  if (!config.invenReportCols?.aging) return []
  if (!config.baseFormat?.l3_field) return []

  const aging = config.invenReportCols.aging
  const today = startOfDay(new Date())

  const eachAging = []

  try {
    console.log(`${config.user} - level 3: query postgres for Inv on hand (l3_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
        'SUBTOTAL' AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

      eachAging.push(response)
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
    console.log(`${config.user} - level 4: query postgres for Inv on hand (l4_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
        COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
        'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

      eachAging.push(response)
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
    console.log(`${config.user} - level 5: query postgres for Inv on hand (l4_getInvAged) ...`)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column, 
        COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
        COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 
        COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 
        COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 
        COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv
        LEFT OUTER JOIN "invenReporting".master_supplement 
          AS ms ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

      eachAging.push(response)
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
    console.log(`${config.user} - level 0: query postgres for Inv on hand (l0_getInvAged) ...`)

    // level 0 detail (TOTAL)

    for (ageBucket of aging) {
      const start = subMonths(today, ageBucket.start)
      const end = addDays(subMonths(today, ageBucket.end), 1)

      const response = await sql
      `SELECT 
        '${sql(ageBucket.dataName)}' AS column,  
        'TOTAL' AS l1_label, 
        COALESCE(SUM(Inv.on_hand_lbs),0) AS lbs, 
        COALESCE(SUM(Inv.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory AS Inv
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = Inv.item_number 
      
      WHERE 
        Inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND Inv.receipt_date <= ${end} AND Inv.receipt_date >= ${start} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

      eachAging.push(response)
    }

    return eachAging
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l5_getInvAged = l5_getInvAged
module.exports.l4_getInvAged = l4_getInvAged
module.exports.l3_getInvAged = l3_getInvAged
module.exports.l2_getInvAged = l2_getInvAged
module.exports.l1_getInvAged = l1_getInvAged
module.exports.l0_getInvAged = l0_getInvAged
