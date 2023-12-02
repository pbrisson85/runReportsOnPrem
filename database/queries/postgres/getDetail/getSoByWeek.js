const sql = require('../../../../server')

const getSoByWk_detail = async (config, weekSerial) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG Sales Orders By Week Detail ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.ext_weight AS lbs, so.ext_sales, so.ext_othp, so.ext_cost, so.gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_cost_per_lb AS cost_lb, so.gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged, so.out_sales_rep, credit_status_desc, logistics_status, so_entered_timestamp
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = so.customer_code
          
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        AND so.week_serial = ${weekSerial} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.l5_field)} = ${config.l5_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getSoTagged_detail = async (config, weekSerial) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.tagged_weight AS lbs, COALESCE(so.tagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.tagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.tagged_weight * ave_tagged_cost,0) AS ext_cost, COALESCE(so.tagged_weight * so.unit_price - so.tagged_weight * so.othp_lb - so.tagged_weight * ave_tagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_tagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_tagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged, so.out_sales_rep, credit_status_desc, logistics_status, so_entered_timestamp
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = so.customer_code
          
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
        AND so.tagged_weight > 0  
        AND so.week_serial = ${weekSerial}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.l5_field)} = ${config.l5_filter}` : sql``}
       ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getSoByWkUntagged_detail = async (config, weekSerial) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres for FG Sales Orders ...`)

    const response = await sql
      `SELECT so.no_cost_found, so.customer_code, so.customer_name, so.so_num, so.location, so.so_line, so.formatted_ship_date, so.week_serial, so.item_num, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, so.untagged_weight AS lbs, COALESCE(so.untagged_weight * so.unit_price,0) AS ext_sales, COALESCE(so.untagged_weight * so.othp_lb,0) AS ext_othp, COALESCE(so.untagged_weight * ave_untagged_cost,0) AS ext_cost, COALESCE(so.untagged_weight * so.unit_price - so.untagged_weight * so.othp_lb - so.untagged_weight * ave_untagged_cost,0) AS gross_margin_ext, so.unit_price, so.rebate_lb, so.discount_lb, so.freight_lb, so.othp_lb, so.sales_net_lb, so.ave_untagged_cost AS cost_lb, COALESCE(so.sales_net_lb - so.ave_untagged_cost,0) AS gross_margin_lb, so.tagged_weight, so.untagged_weight, so.ave_tagged_cost, so.ave_untagged_cost, so.ext_comm, so.commission_lb, so.sales_net_ext, so.ext_rebate, so.ext_discount, so.ext_freight, so.cost_ext_tagged, so.cost_ext_untagged, so.out_sales_rep, credit_status_desc, logistics_status, so_entered_timestamp
      
      FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = so.item_num 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = so.customer_code
          
      WHERE 
        so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
        AND so.untagged_weight > 0 
        AND so.week_serial = ${weekSerial}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.l5_field)} = ${config.l5_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSoByWk_detail = getSoByWk_detail
module.exports.getSoTagged_detail = getSoTagged_detail
module.exports.getSoByWkUntagged_detail = getSoByWkUntagged_detail
