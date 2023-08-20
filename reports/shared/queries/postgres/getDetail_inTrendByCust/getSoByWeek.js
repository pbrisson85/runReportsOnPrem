const sql = require('../../../../../server')

/* *********************************************** level 1 *********************************************** */

const lvl_1_subtotal_getSoByWk_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 1: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} =  ${filters[0]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoTagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
     `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getSoByWkUntagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 2 *********************************************** */

const lvl_2_subtotal_getSoByWk_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 2: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoTagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getSoByWkUntagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 
          
      FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** level 3 *********************************************** */

const lvl_3_subtotal_getSoByWk_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND ${sql(config.l3_field)} =  ${filters[2]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoTagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND ${sql(config.l3_field)} =  ${filters[2]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getSoByWkUntagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 3: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND ${sql(config.l1_field)} =  ${filters[0]} AND ${sql(config.l2_field)} =  ${filters[1]} AND ${sql(config.l3_field)} =  ${filters[2]} AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getSoByWk_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoTagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
      
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.tagged_weight > 0 AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getSoByWkUntagged_detail = async (config, program, filters, weekSerial) => {
  try {
    console.log(`level 0: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
          
      WHERE ms.item_type = ${'FG'} AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) ${program ? sql`AND ms.program = ${program}`: sql``} AND ms.byproduct_type IS NULL AND so.untagged_weight > 0 AND so.week_serial = ${weekSerial} AND so.customer_code = ${filters[3]}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getSoByWk_detail = lvl_1_subtotal_getSoByWk_detail
module.exports.lvl_2_subtotal_getSoByWk_detail = lvl_2_subtotal_getSoByWk_detail
module.exports.lvl_3_subtotal_getSoByWk_detail = lvl_3_subtotal_getSoByWk_detail
module.exports.lvl_3_subtotal_getSoTagged_detail = lvl_3_subtotal_getSoTagged_detail
module.exports.lvl_3_subtotal_getSoByWkUntagged_detail = lvl_3_subtotal_getSoByWkUntagged_detail
module.exports.lvl_0_total_getSoByWk_detail = lvl_0_total_getSoByWk_detail
module.exports.lvl_0_total_getSoTagged_detail = lvl_0_total_getSoTagged_detail
module.exports.lvl_0_total_getSoByWkUntagged_detail = lvl_0_total_getSoByWkUntagged_detail
module.exports.lvl_2_subtotal_getSoTagged_detail = lvl_2_subtotal_getSoTagged_detail
module.exports.lvl_2_subtotal_getSoByWkUntagged_detail = lvl_2_subtotal_getSoByWkUntagged_detail
module.exports.lvl_1_subtotal_getSoTagged_detail = lvl_1_subtotal_getSoTagged_detail
module.exports.lvl_1_subtotal_getSoByWkUntagged_detail = lvl_1_subtotal_getSoByWkUntagged_detail
