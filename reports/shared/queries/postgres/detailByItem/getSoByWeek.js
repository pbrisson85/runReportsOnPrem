/* *********************************************** level 1 *********************************************** */

const byItem_getSoByWk_detail = async (itemCode, weekSerial) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_num = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND so.week_serial = $2`, [itemCode, weekSerial]
     ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const byItem_getSoTagged_detail = async (itemCode, weekSerial) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
     `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_num = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND so.tagged_weight > 0 AND so.week_serial = $2`, [itemCode, weekSerial]
   ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const byItem_getSoByWkUntagged_detail = async (itemCode, weekSerial) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await pgClient.query(
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_num = $1 AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND so.untagged_weight > 0 AND so.week_serial = $2`, [itemCode, weekSerial]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.byItem_getSoByWk_detail = byItem_getSoByWk_detail
module.exports.byItem_getSoTagged_detail = byItem_getSoTagged_detail
module.exports.byItem_getSoByWkUntagged_detail = byItem_getSoByWkUntagged_detail
