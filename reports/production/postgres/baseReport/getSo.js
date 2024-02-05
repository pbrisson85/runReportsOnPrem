const sql = require('../../../../server')

const l1_getSo = async config => {
  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders (l1_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      'SUBTOTAL' AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb" 
      
      FROM "salesReporting".sales_orders AS so
       LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
       ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSo = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for FG Sales Orders (l2_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      'SUBTOTAL' AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb"
      
      FROM "salesReporting".sales_orders AS so
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = so.item_num 

      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSo = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders (l3_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      'SUBTOTAL' AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb"
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 

      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
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

const l4_getSo = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders (l4_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      'SUBTOTAL' AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb"
      
      FROM "salesReporting".sales_orders AS so
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
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

const l5_getSo = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders (l4_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
      COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
      COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
      COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
      COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs, 
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb"
      
      FROM "salesReporting".sales_orders AS so
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = so.item_num 

      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
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

const l0_getSo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders (l0_getSo) ...`)

    const response = await sql
      `SELECT 
      'SALES ORDER' AS column, 
      'TOTAL' AS l1_label, 
      COALESCE(SUM(so.ext_weight),0) AS lbs, 
      COALESCE(SUM(so.ext_cost),0) AS cogs,
      COALESCE(SUM(so.ext_cost)/NULLIF(SUM(so.ext_weight),0),0) AS "cogsPerLb"
      
      FROM "salesReporting".sales_orders AS so
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = so.item_num 

      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getSo, l1_getSo, l2_getSo, l3_getSo, l4_getSo, l5_getSo }
