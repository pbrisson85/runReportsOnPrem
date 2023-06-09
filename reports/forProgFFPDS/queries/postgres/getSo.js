/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
         'SELECT \'FG OPEN ORDER\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_detail, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen', ['FG', program]
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

    console.log(`query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, \'SUBTOTAL\' AS l3_detail, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_detail_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, master_supplement.fg_fresh_frozen AS l1_subtotal, master_supplement.fg_treatment AS l2_subtotal, master_supplement.size_name AS l3_detail, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.program = $2 GROUP BY master_supplement.fg_fresh_frozen, master_supplement.fg_treatment, master_supplement.size_name', ['FG', program]
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const dataTotal_getSo = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
           'SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_detail, COALESCE(SUM(sales_orders.ext_weight),0) AS lbs, COALESCE(SUM(sales_orders.ext_sales),0) AS sales, COALESCE(SUM(sales_orders.ext_cost),0) AS cogs, COALESCE(SUM(sales_orders.ext_othp),0) AS othp FROM "salesReporting".sales_orders LEFT OUTER JOIN "invenReporting".master_supplement ON master_supplement.item_num = sales_orders.item_num WHERE master_supplement.item_type = $1 AND sales_orders.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND master_supplement.program = $2', ['FG', program]
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
module.exports.lvl_3_detail_getSo = lvl_3_detail_getSo
module.exports.dataTotal_getSo = dataTotal_getSo
