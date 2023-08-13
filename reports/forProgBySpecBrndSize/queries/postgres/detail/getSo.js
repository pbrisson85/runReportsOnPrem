const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSo_detail = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG Sales Orders ...`)

    // Note that this is pulling ext_cost and the cost on a sales order is determined in the runSalesOrdersOnPrem app using the tagged lots, if no tagged lots then using the average on hand, if no average on hand then using the last sales order cost, if no sales orders THEN THERE IS NO COST. We will need to start generating a standard cost for inventory and use that instead of the last sales order cost.

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} = ${filters[0]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
     `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoUntagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const lvl_2_subtotal_getSo_detail = async (config, program, filters) => {
  try {
    console.log(`level 2: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoUntagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 
          
      FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_subtotal_getSo_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} AND ${sql(config.l3_field)} = ${filters[2]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoTagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} AND ${sql(config.l3_field)} = ${filters[2]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoUntagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} = ${filters[0]} AND ${sql(config.l2_field)} = ${filters[1]} AND ${sql(config.l3_field)} = ${filters[2]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSo_detail = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoUntagged_detail = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) AND ms.program = ${program} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0` //prettier-ignore

    return response
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
