/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
         `SELECT \'FG OPEN ORDER\' AS column, ms.item_num AS l1_label, ms.description AS l2_label,  ms.species AS l3_label, ms.fg_treatment AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_orders.item_num 
            
        WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.customer_code = $3
        
        GROUP BY ms.item_num, ms.description,ms.species, ms.fg_treatment, ms.size_name`, ['FG', program, filters[3]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           `SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.item_num AS l1_label, ms.description AS l2_label,  ms.species AS l3_label, ms.fg_treatment AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
          WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 AND sales_orders.customer_code = $3 
          
          GROUP BY ms.item_num, ms.description,ms.species, ms.fg_treatment, ms.size_name`, ['FG', program, filters[3]]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.item_num AS l1_label, ms.description AS l2_label,  ms.species AS l3_label, ms.fg_treatment AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 AND sales_orders.customer_code = $3
      
      GROUP BY ms.item_num, ms.description,ms.species, ms.fg_treatment, ms.size_name`, ['FG', program, filters[3]]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.customer_code = $3`, ['FG', program, filters[3]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT \'FG OPEN ORDER TAGGED\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 AND sales_orders.customer_code = $3`, ['FG', program, filters[3]]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT \'FG OPEN ORDER UNTAGGED\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp 
      
      FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_orders.item_num 
          
      WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 AND sales_orders.customer_code = $3`, ['FG', program, filters[3]]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSo = lvl_1_subtotal_getSo
module.exports.lvl_0_total_getSo = lvl_0_total_getSo
module.exports.lvl_0_total_getSoTagged = lvl_0_total_getSoTagged
module.exports.lvl_0_total_getSoUntagged = lvl_0_total_getSoUntagged
module.exports.lvl_1_subtotal_getSoTagged = lvl_1_subtotal_getSoTagged
module.exports.lvl_1_subtotal_getSoUntagged = lvl_1_subtotal_getSoUntagged
