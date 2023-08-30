const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for FG Sales Orders By Week (lvl_1_subtotal_getSo_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_1_subtotal_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_1_subtotal_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const lvl_2_subtotal_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for FG Sales Orders By Week (lvl_2_subtotal_getSo_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_2_subtotal_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_2_subtotal_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_subtotal_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_3_subtotal_getSo_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_3_subtotal_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for FG Sales Orders By Week (lvl_3_subtotal_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 4 *********************************************** */

const lvl_4_subtotal_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (lvl_4_subtotal_getSo_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_4_subtotal_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (lvl_4_subtotal_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_tg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_4_subtotal_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for FG Sales Orders By Week (lvl_4_subtotal_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_untg' AS column, COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0 
      
      GROUP BY sales_orders.week_serial, ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (lvl_0_total_getSo_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (lvl_0_total_getSoTagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_tg' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.tagged_weight > 0 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged_byWk = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG Sales Orders By Week (lvl_0_total_getSoUntagged_byWk) ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || '_so_untg' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num 
      
      WHERE 
        ms.item_type = ${'FG'} 
        AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        AND ms.byproduct_type IS NULL 
        AND sales_orders.untagged_weight > 0 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_4_subtotal_getSo_byWk = lvl_4_subtotal_getSo_byWk
module.exports.lvl_4_subtotal_getSoTagged_byWk = lvl_4_subtotal_getSoTagged_byWk
module.exports.lvl_4_subtotal_getSoUntagged_byWk = lvl_4_subtotal_getSoUntagged_byWk

module.exports.lvl_3_subtotal_getSo_byWk = lvl_3_subtotal_getSo_byWk
module.exports.lvl_3_subtotal_getSoTagged_byWk = lvl_3_subtotal_getSoTagged_byWk
module.exports.lvl_3_subtotal_getSoUntagged_byWk = lvl_3_subtotal_getSoUntagged_byWk

module.exports.lvl_0_total_getSo_byWk = lvl_0_total_getSo_byWk
module.exports.lvl_0_total_getSoTagged_byWk = lvl_0_total_getSoTagged_byWk
module.exports.lvl_0_total_getSoUntagged_byWk = lvl_0_total_getSoUntagged_byWk

module.exports.lvl_2_subtotal_getSo_byWk = lvl_2_subtotal_getSo_byWk
module.exports.lvl_2_subtotal_getSoTagged_byWk = lvl_2_subtotal_getSoTagged_byWk
module.exports.lvl_2_subtotal_getSoUntagged_byWk = lvl_2_subtotal_getSoUntagged_byWk

module.exports.lvl_1_subtotal_getSo_byWk = lvl_1_subtotal_getSo_byWk
module.exports.lvl_1_subtotal_getSoTagged_byWk = lvl_1_subtotal_getSoTagged_byWk
module.exports.lvl_1_subtotal_getSoUntagged_byWk = lvl_1_subtotal_getSoUntagged_byWk
