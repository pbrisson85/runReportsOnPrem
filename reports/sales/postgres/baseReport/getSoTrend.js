const sql = require('../../../../server')

const l1_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week (l1_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``}
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for FG Sales Orders By Week (l2_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)}, ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoTrend = async config => {
  if (!config.dates.trends.queryGrouping) return []

  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoTrend) ...`)

    const response = await sql
      `SELECT 
      ${sql(config.dates.trends.queryGrouping)} || '_so' AS column, 
      'TOTAL' AS l1_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_sales),0) AS "grossSales", 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_othp),0) AS othp, 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_othp),0) AS "netSales", 
      COALESCE(SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp),0) AS "grossMargin", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp)) / NULLIF(SUM(so.ext_sales),0),0) AS "grossMarginPercent", 
      COALESCE(SUM(so.ext_sales)/NULLIF(SUM(so.ext_weight),0),0) AS "grossSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "netSalesPerLb", 
      COALESCE((SUM(so.ext_sales) - SUM(so.ext_cost) - SUM(so.ext_othp))/NULLIF(SUM(so.ext_weight),0),0) AS "grossMarginPerLb", 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb", 
      COALESCE(SUM(so.ext_othp)/NULLIF(SUM(so.ext_weight),0),0) AS "othpPerLb" 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON so.formatted_ship_date = p.formatted_date
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.dates.trends.queryGrouping)} 
      
      ORDER BY ${sql(config.dates.trends.queryGrouping)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l5_getSoTrend, l4_getSoTrend, l3_getSoTrend, l2_getSoTrend, l1_getSoTrend, l0_getSoTrend }
