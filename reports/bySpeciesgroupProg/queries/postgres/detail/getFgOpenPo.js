/* *********************************************** Level 1 *********************************************** */

const lvl_1_subtotal_getFgPo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG open PO ...`)

    const response = await pgClient.query(
        `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
         
         FROM "invenReporting".perpetual_inventory AS p
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = p.item_number 
            
        WHERE ms.item_type = $1 AND p.on_order_lbs <> 0 AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) AND ms.species_group = $2`, ['FG', filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const lvl_2_subtotal_getFgPo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG open PO ...`)

    const response = await pgClient.query(
       `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
       
       FROM "invenReporting".perpetual_inventory AS p
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = p.item_number 
          
      WHERE ms.item_type = $1 AND p.on_order_lbs <> 0 AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2) AND ms.species_group = $2 AND ms.program = $3`, ['FG', filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const lvl_0_total_getFgPo_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG open PO ...`)

    const response = await pgClient.query(
         `SELECT p.item_number, ms.description, p.location_code, p.location_country, ms.fg_fresh_frozen, ms.species, ms.fg_treatment, ms.brand, ms.size_name, p.po_vendor, p.po_number, p.eta_date, p.on_order_lbs, p.on_order_extended, COALESCE(p.on_order_extended/p.on_order_lbs,0) AS cost_lb
         
         FROM "invenReporting".perpetual_inventory AS p 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = p.item_number 
            
        WHERE ms.item_type = $1 AND p.on_order_lbs <> 0 AND p.version = (SELECT MAX(p2.version) - 1 FROM "invenReporting".perpetual_inventory AS p2)`, ['FG']
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgPo_detail = lvl_1_subtotal_getFgPo_detail
module.exports.lvl_2_subtotal_getFgPo_detail = lvl_2_subtotal_getFgPo_detail
module.exports.lvl_0_total_getFgPo_detail = lvl_0_total_getFgPo_detail
