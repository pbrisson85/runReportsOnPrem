const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)
const byItem_getFgInven_detail = async item => {
  try {
    console.log(`level 1 Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response =
      await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.item_num = ${item}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const byItem_getFgInTransit_detail = async item => {
  try {
    console.log(`level 1 Detail: query postgres for FG in transit ...`)

    const response =
      await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.item_num = ${item}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const byItem_getFgAtLoc_detail = async item => {
  try {
    console.log(`level 1 Detail: query postgres for FG at location ...`)

    const response =
      await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.item_num = ${item}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Going to need to revisit this one
const byItem_getFgAtLoc_untagged_detail = async item => {
  try {
    console.log(`level 1 Detail: query postgres for FG at location UNTAGGED ...`)

    const response =
      await sql`SELECT all_inven.receipt_date, all_inven.location_date, all_inven.lot_text, all_inven.msc_cert_bool AS msc, all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country, all_inven.fresh_frozen
          
          FROM (
              SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
                  FROM "invenReporting".perpetual_inventory AS pi 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = pi.item_number 
                  WHERE pi.on_hand_lbs <> 0 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 
                  FROM "invenReporting".perpetual_inventory) AND pi.location_type <> ${'IN TRANSIT'} AND ms.item_num = ${item}) 
                  AS all_inven
                   
          LEFT OUTER JOIN (
              SELECT ti.location, ti.item_num AS item, ti.lot, SUM(ti.weight) AS lbs, SUM(ti.cost * ti.weight) AS cost_ext 
                  FROM "salesReporting".tagged_inventory AS ti 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = ti.item_num   
                  WHERE ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.item_num = ${item}
                  GROUP BY ti.location, ti.item_num, ti.lot)   
              AS tagged_inven 
              
          ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const byItem_getFgAtLoc_tagged_detail = async item => {
  try {
    console.log(`level 1 Detail: query postgres for FG at location TAGGED ...`)

    const response =
      await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country, ms.fg_fresh_frozen AS fresh_frozen 
              
          FROM "salesReporting".tagged_inventory AS ti 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = ti.item_num 
              LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                  ON loc.location_code = ti.location  
              LEFT OUTER JOIN "invenReporting".perpetual_inventory AS pi
                  ON pi.item_number = ti.item_num AND pi.lot = ti.lot AND pi.location_code = ti.location
          
          WHERE ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.item_num = ${item}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.byItem_getFgInven_detail = byItem_getFgInven_detail
module.exports.byItem_getFgInTransit_detail = byItem_getFgInTransit_detail
module.exports.byItem_getFgAtLoc_detail = byItem_getFgAtLoc_detail
module.exports.byItem_getFgAtLoc_untagged_detail = byItem_getFgAtLoc_untagged_detail
module.exports.byItem_getFgAtLoc_tagged_detail = byItem_getFgAtLoc_tagged_detail
