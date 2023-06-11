/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getSo = async () => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level1: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, master_supplement.species_group AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.byproduct_type IS NULL GROUP BY master_supplement.species_group', ['FG']
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

    console.log(`level2: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
         'SELECT \'FG OPEN ORDER\' AS column, master_supplement.species_group AS l1_subtotal, master_supplement.program AS l2_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.byproduct_type IS NULL GROUP BY master_supplement.species_group, master_supplement.program', ['FG']
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

    console.log(`total: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.byproduct_type IS NULL', ['FG']
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
