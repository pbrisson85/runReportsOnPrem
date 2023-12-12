const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const l1_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const l2_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const l3_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 4 *********************************************** */

const l4_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 5 *********************************************** */

const l5_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getSoTaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoTaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_tg' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoUntaggedTrend = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoUntaggedTrend) ...`)

    const response = await sql
      `SELECT ${sql(config.trends.queryGrouping)} || '_so_untg' AS column${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY ${sql(config.trends.queryGrouping)} 
      
      ORDER BY ${sql(config.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l5_getSoTaggedTrend = l5_getSoTaggedTrend
module.exports.l5_getSoUntaggedTrend = l5_getSoUntaggedTrend

module.exports.l4_getSoTaggedTrend = l4_getSoTaggedTrend
module.exports.l4_getSoUntaggedTrend = l4_getSoUntaggedTrend

module.exports.l3_getSoTaggedTrend = l3_getSoTaggedTrend
module.exports.l3_getSoUntaggedTrend = l3_getSoUntaggedTrend

module.exports.l0_getSoTaggedTrend = l0_getSoTaggedTrend
module.exports.l0_getSoUntaggedTrend = l0_getSoUntaggedTrend

module.exports.l2_getSoTaggedTrend = l2_getSoTaggedTrend
module.exports.l2_getSoUntaggedTrend = l2_getSoUntaggedTrend

module.exports.l1_getSoTaggedTrend = l1_getSoTaggedTrend
module.exports.l1_getSoUntaggedTrend = l1_getSoUntaggedTrend
