const sql = require('../../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_byWk = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
         `SELECT sales_orders.week_serial || \'_so\' AS column, ms.item_num AS l1_label, ms.description AS l2_label,${sql(config.l2_field)} AS l3_label, ${sql(config.l3_field)} AS l4_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_orders.item_num 
            
          WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} = ${filters[0]} 
          
          GROUP BY sales_orders.week_serial, ms.item_num, ms.description, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
          
          ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_byWk = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
           `SELECT sales_orders.week_serial || \'_so_tg\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label, ${sql(config.l3_field)} AS l4_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]}
          
          GROUP BY sales_orders.week_serial, ms.item_num, ms.description,${sql(config.l2_field)}, ${sql(config.l3_field)} 
          
          ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged_byWk = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || \'_so_untg\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ${sql(config.l2_field)} AS l3_label, ${sql(config.l3_field)} AS l4_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} 
      
      GROUP BY sales_orders.week_serial, ms.item_num, ms.description, ${sql(config.l2_field)},${sql(config.l3_field)} 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_byWk = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || \'_so\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} = ${filters[0]} 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged_byWk = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || \'_so_tg\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged_byWk = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders By Week ...`)

    const response = await sql
      `SELECT sales_orders.week_serial || \'_so_untg\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = ${'FG'} AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} 
      
      GROUP BY sales_orders.week_serial 
      
      ORDER BY sales_orders.week_serial` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSo_byWk = lvl_1_subtotal_getSo_byWk
module.exports.lvl_0_total_getSo_byWk = lvl_0_total_getSo_byWk
module.exports.lvl_0_total_getSoTagged_byWk = lvl_0_total_getSoTagged_byWk
module.exports.lvl_0_total_getSoUntagged_byWk = lvl_0_total_getSoUntagged_byWk
module.exports.lvl_1_subtotal_getSoTagged_byWk = lvl_1_subtotal_getSoTagged_byWk
module.exports.lvl_1_subtotal_getSoUntagged_byWk = lvl_1_subtotal_getSoUntagged_byWk