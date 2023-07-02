/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.ext_weight AS lbs, so.ext_sales AS sales, so.ext_cost AS cogs, so.ext_othp AS othp, so.unit_price, so.ave_cost_per_lb AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND ms.fg_fresh_frozen = $3`, ['FG', program, filters[0]]
     ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS cogs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_tagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ms.fg_fresh_frozen = $3`, ['FG', program, filters[0]]
   ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS cogs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_untagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ms.fg_fresh_frozen = $3`, ['FG', program, filters[0]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const lvl_2_subtotal_getSo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.ext_weight AS lbs, so.ext_sales AS sales, so.ext_cost AS cogs, so.ext_othp AS othp, so.unit_price, so.ave_cost_per_lb AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost  
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4`, ['FG', program, filters[0], filters[1]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS cogs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_tagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4`, ['FG', program, filters[0], filters[1]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoUntagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS cogs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_untagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 
          
      FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4`, ['FG', program, filters[0], filters[1]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_subtotal_getSo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.ext_weight AS lbs, so.ext_sales AS sales, so.ext_cost AS cogs, so.ext_othp AS othp, so.unit_price, so.ave_cost_per_lb AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5`, ['FG', program, filters[0], filters[1], filters[2]]
     ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoTagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS cogs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_tagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5`, ['FG', program,  filters[0], filters[1], filters[2]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoUntagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS cogs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_untagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ms.fg_fresh_frozen = $3 AND ms.fg_treatment = $4 AND ms.size_name = $5`, ['FG', program,  filters[0], filters[1], filters[2]]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.ext_weight AS lbs, so.ext_sales AS sales, so.ext_cost AS cogs, so.ext_othp AS othp, so.unit_price, so.ave_cost_per_lb AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost 
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL`, ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS cogs, COALESCE(so.tagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_tagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.tagged_weight > 0`, ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location AS inven_location, so.so_line, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item, ms.description, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ms.fg_fresh_frozen AS fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_sales,0) AS sales, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS cogs, COALESCE(so.untagged_weight / so.ext_weight * so.ext_othp,0) AS othp, so.unit_price, so.ave_untagged_cost AS cost_lb, so.ext_rebate/so.ext_weight AS rebate_per_lb, so.ext_discount/so.ext_weight AS discount_per_lb, so.ext_freight/so.ext_weight AS freight_per_lb, so.ext_othp/so.ext_weight AS othp_per_lb
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND so.untagged_weight > 0`, ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSo_detail = lvl_1_subtotal_getSo_detail
module.exports.lvl_2_subtotal_getSo_detail = lvl_2_subtotal_getSo_detail
module.exports.lvl_3_subtotal_getSo_detail = lvl_3_subtotal_getSo_detail
module.exports.lvl_3_subtotal_getSoTagged_detail = lvl_3_subtotal_getSoTagged_detail
module.exports.lvl_3_subtotal_getSoUntagged_detail = lvl_3_subtotal_getSoUntagged_detail
module.exports.lvl_0_total_getSo_detail = lvl_0_total_getSo_detail
module.exports.lvl_0_total_getSoTagged_detail = lvl_0_total_getSoTagged_detail
module.exports.lvl_0_total_getSoUntagged_detail = lvl_0_total_getSoUntagged_detail
module.exports.lvl_2_subtotal_getSoTagged_detail = lvl_2_subtotal_getSoTagged_detail
module.exports.lvl_2_subtotal_getSoUntagged_detail = lvl_2_subtotal_getSoUntagged_detail
module.exports.lvl_1_subtotal_getSoTagged_detail = lvl_1_subtotal_getSoTagged_detail
module.exports.lvl_1_subtotal_getSoUntagged_detail = lvl_1_subtotal_getSoUntagged_detail
