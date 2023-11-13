const sql = require('../../../../server')

/* *********************************************** level 1 *********************************************** */

const l1_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week (l1_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``}
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l1_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const l2_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for FG Sales Orders By Week (l2_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l2_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const l3_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (l3_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 4 *********************************************** */

const l4_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (l4_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 5 *********************************************** */

const l5_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)}
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for FG Sales Orders By Week (l4_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.l5_field)},'NA') AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}, ${sql(config.l5_field)} 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSo_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY so.week_serial 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_tg' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.tagged_weight),0) AS lbs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(so.tagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.tagged_weight > 0 
      
      GROUP BY so.week_serial 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (l0_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT so.week_serial || '_so_untg' AS column${config.itemType ? sql`, REPLACE('${sql(config.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(so.untagged_weight),0) AS lbs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_sales),0) AS sales, COALESCE(SUM(so.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(so.untagged_weight / so.ext_weight * so.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE 
        so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1) 
        ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND so.untagged_weight > 0 
      
      GROUP BY so.week_serial 
      
      ORDER BY so.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l5_getSo_byWk = l5_getSo_byWk
module.exports.l5_getSoTagged_byWk = l5_getSoTagged_byWk
module.exports.l5_getSoUntagged_byWk = l5_getSoUntagged_byWk

module.exports.l4_getSo_byWk = l4_getSo_byWk
module.exports.l4_getSoTagged_byWk = l4_getSoTagged_byWk
module.exports.l4_getSoUntagged_byWk = l4_getSoUntagged_byWk

module.exports.l3_getSo_byWk = l3_getSo_byWk
module.exports.l3_getSoTagged_byWk = l3_getSoTagged_byWk
module.exports.l3_getSoUntagged_byWk = l3_getSoUntagged_byWk

module.exports.l0_getSo_byWk = l0_getSo_byWk
module.exports.l0_getSoTagged_byWk = l0_getSoTagged_byWk
module.exports.l0_getSoUntagged_byWk = l0_getSoUntagged_byWk

module.exports.l2_getSo_byWk = l2_getSo_byWk
module.exports.l2_getSoTagged_byWk = l2_getSoTagged_byWk
module.exports.l2_getSoUntagged_byWk = l2_getSoUntagged_byWk

module.exports.l1_getSo_byWk = l1_getSo_byWk
module.exports.l1_getSoTagged_byWk = l1_getSoTagged_byWk
module.exports.l1_getSoUntagged_byWk = l1_getSoUntagged_byWk
