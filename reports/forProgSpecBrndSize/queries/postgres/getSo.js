/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
         'SELECT \'FG OPEN ORDER\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL GROUP BY ms.species', ['FG', program]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY ms.species', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY ms.species', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const lvl_2_subtotal_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL GROUP BY ms.species, ms.brand', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY ms.species, ms.brand', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoUntagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY ms.species, ms.brand', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_subtotal_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL GROUP BY ms.species, ms.brand, ms.size_name', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoTagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY ms.species, ms.brand, ms.size_name', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoUntagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY ms.species, ms.brand, ms.size_name', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER TAGGED\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSo = lvl_1_subtotal_getSo
module.exports.lvl_2_subtotal_getSo = lvl_2_subtotal_getSo
module.exports.lvl_3_subtotal_getSo = lvl_3_subtotal_getSo
module.exports.lvl_3_subtotal_getSoTagged = lvl_3_subtotal_getSoTagged
module.exports.lvl_3_subtotal_getSoUntagged = lvl_3_subtotal_getSoUntagged
module.exports.lvl_0_total_getSo = lvl_0_total_getSo
module.exports.lvl_0_total_getSoTagged = lvl_0_total_getSoTagged
module.exports.lvl_0_total_getSoUntagged = lvl_0_total_getSoUntagged
module.exports.lvl_2_subtotal_getSoTagged = lvl_2_subtotal_getSoTagged
module.exports.lvl_2_subtotal_getSoUntagged = lvl_2_subtotal_getSoUntagged
module.exports.lvl_1_subtotal_getSoTagged = lvl_1_subtotal_getSoTagged
module.exports.lvl_1_subtotal_getSoUntagged = lvl_1_subtotal_getSoUntagged
