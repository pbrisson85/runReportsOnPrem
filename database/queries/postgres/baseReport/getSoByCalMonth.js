const sql = require('../../../../server')

/* *********************************************** level 1 *********************************************** */

const l1_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week (l1_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``}
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const l2_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for FG Sales Orders By Week (l2_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const l3_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 4 *********************************************** */

const l4_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 5 *********************************************** */

const l5_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getSo_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSo_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY p.cal_month_serial 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoTagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoTagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_tg' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY p.cal_month_serial 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoUntagged_byCalMo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoUntagged_byCalMo) ...`)

    const response = await sql
      `SELECT p.cal_month_serial || '_so_untg' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY p.cal_month_serial 
      
      ORDER BY p.cal_month_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l5_getSo_byCalMo = l5_getSo_byCalMo
module.exports.l5_getSoTagged_byCalMo = l5_getSoTagged_byCalMo
module.exports.l5_getSoUntagged_byCalMo = l5_getSoUntagged_byCalMo

module.exports.l4_getSo_byCalMo = l4_getSo_byCalMo
module.exports.l4_getSoTagged_byCalMo = l4_getSoTagged_byCalMo
module.exports.l4_getSoUntagged_byCalMo = l4_getSoUntagged_byCalMo

module.exports.l3_getSo_byCalMo = l3_getSo_byCalMo
module.exports.l3_getSoTagged_byCalMo = l3_getSoTagged_byCalMo
module.exports.l3_getSoUntagged_byCalMo = l3_getSoUntagged_byCalMo

module.exports.l0_getSo_byCalMo = l0_getSo_byCalMo
module.exports.l0_getSoTagged_byCalMo = l0_getSoTagged_byCalMo
module.exports.l0_getSoUntagged_byCalMo = l0_getSoUntagged_byCalMo

module.exports.l2_getSo_byCalMo = l2_getSo_byCalMo
module.exports.l2_getSoTagged_byCalMo = l2_getSoTagged_byCalMo
module.exports.l2_getSoUntagged_byCalMo = l2_getSoUntagged_byCalMo

module.exports.l1_getSo_byCalMo = l1_getSo_byCalMo
module.exports.l1_getSoTagged_byCalMo = l1_getSoTagged_byCalMo
module.exports.l1_getSoUntagged_byCalMo = l1_getSoUntagged_byCalMo
