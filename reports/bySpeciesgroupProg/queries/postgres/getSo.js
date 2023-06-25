/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getSo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL GROUP BY ms.species_group', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders TAGGED ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY ms.species_group', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders UNTAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY ms.species_group', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 1 BY WEEK *********************************************** */

const lvl_1_subtotal_getSo_byWk = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders BY WEEK ...`)

    const response = await pgClient.query(
           'SELECT sales_orders.week_serial || \'_so\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL GROUP BY sales_orders.week_serial, ms.species_group ORDER BY sales_orders.week_serial', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_byWk = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders TAGGED BY WEEK ...`)

    const response = await pgClient.query(
           'SELECT sales_orders.week_serial || \'_so_tg\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY sales_orders.week_serial, ms.species_group ORDER BY sales_orders.week_serial', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged_byWk = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders UNTAGGED BY WEEK ...`)

    const response = await pgClient.query(
      'SELECT sales_orders.week_serial || \'_so_untg\' AS column, ms.species_group AS l1_label, \'SUBTOTAL\' AS l2_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY sales_orders.week_serial, ms.species_group ORDER BY sales_orders.week_serial', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

const lvl_2_subtotal_getSo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
         'SELECT \'FG OPEN ORDER\' AS column, ms.species_group AS l1_label, ms.program AS l2_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL GROUP BY ms.species_group, ms.program', ['FG']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG Sales Orders TAGGED ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER TAGGED\' AS column, ms.species_group AS l1_label, ms.program AS l2_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0 GROUP BY ms.species_group, ms.program', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoUntagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG Sales Orders UNTAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, ms.species_group AS l1_label, ms.program AS l2_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0 GROUP BY ms.species_group, ms.program', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders TAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER TAGGED\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, COALESCE(SUM(sales_orders.tagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.tagged_weight * ave_tagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.tagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.tagged_weight > 0', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG Sales Orders UNTAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG OPEN ORDER UNTAGGED\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, COALESCE(SUM(sales_orders.untagged_weight),0) AS lbs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.untagged_weight * ave_untagged_cost),0) AS cogs, COALESCE(SUM(sales_orders.untagged_weight / sales_orders.ext_weight * sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = sales_orders.item_num WHERE ms.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.byproduct_type IS NULL AND sales_orders.untagged_weight > 0', ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_2_subtotal_getSo = lvl_2_subtotal_getSo
module.exports.lvl_1_subtotal_getSo = lvl_1_subtotal_getSo
module.exports.lvl_0_total_getSo = lvl_0_total_getSo
module.exports.lvl_1_subtotal_getSoTagged = lvl_1_subtotal_getSoTagged
module.exports.lvl_1_subtotal_getSoUntagged = lvl_1_subtotal_getSoUntagged
module.exports.lvl_2_subtotal_getSoTagged = lvl_2_subtotal_getSoTagged
module.exports.lvl_2_subtotal_getSoUntagged = lvl_2_subtotal_getSoUntagged
module.exports.lvl_0_total_getSoTagged = lvl_0_total_getSoTagged
module.exports.lvl_0_total_getSoUntagged = lvl_0_total_getSoUntagged
module.exports.lvl_1_subtotal_getSo_byWk = lvl_1_subtotal_getSo_byWk
module.exports.lvl_1_subtotal_getSoTagged_byWk = lvl_1_subtotal_getSoTagged_byWk
module.exports.lvl_1_subtotal_getSoUntagged_byWk = lvl_1_subtotal_getSoUntagged_byWk
