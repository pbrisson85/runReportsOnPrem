// method of converting from standard report to item drillDown:
// Level 1:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.brand = filters[1] AND ms.size_name = filters[2]
// 3. change GROUP BY to ms.item_num

// Level 2: delete
// Level 3: delete
// Total:
// 1. replace: [something] AS l1_label, [something] AS l2_label, [something] AS l3_label with ms.item_num AS l1_label
// 2. add: WHERE ms.fg_fresh_frozen = filters[0] AND ms.brand = filters[1] AND ms.size_name = filters[2]

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await pgClient.query(
         `SELECT \'FG OPEN ORDER\' AS column, so.customer_code AS l1_label, so.customer_name AS l2_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
         
         FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
            
        WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND ms.fg_fresh_frozen = $3 AND ms.brand = $4 
        
        GROUP BY so.customer_code, so.customer_name`, ['FG', program, filters[0], filters[1]]
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
           `SELECT \'FG OPEN ORDER\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(so.ext_weight),0) AS lbs, COALESCE(SUM(so.ext_sales),0) AS sales, COALESCE(SUM(so.ext_cost),0) AS cogs, COALESCE(SUM(so.ext_othp),0) AS othp 
           
           FROM "salesReporting".sales_orders AS so 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
              
          WHERE ms.item_type = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = $2 AND ms.byproduct_type IS NULL AND ms.fg_fresh_frozen = $3 AND ms.brand = $4`, ['FG', program, filters[0], filters[1]]
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
