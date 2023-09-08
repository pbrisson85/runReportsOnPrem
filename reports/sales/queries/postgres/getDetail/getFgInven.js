const sql = require('../../../../../server')

// FG on hand (includes in transit)
const getFgInven_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel} Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE 
            pi.on_hand_lbs <> 0 
            AND ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``}
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
            
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const getFgInTransit_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel} Detail: query postgres for FG in transit ...`)

    const response = await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE 
            pi.on_hand_lbs <> 0 
            AND ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            AND pi.location_type = ${'IN TRANSIT'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``}  
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const getFgAtLoc_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel} Detail: query postgres for FG at location ...`)

    const response = await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
          
          WHERE 
            pi.on_hand_lbs <> 0 
            AND ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            AND pi.location_type <> ${'IN TRANSIT'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Going to need to revisit this one
const getFgAtLoc_untagged_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel} Detail: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
          `SELECT all_inven.receipt_date, all_inven.location_date, all_inven.lot_text, all_inven.msc, all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country, all_inven.fresh_frozen 
          
          FROM (
              SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
                  
              FROM "invenReporting".perpetual_inventory AS pi 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = pi.item_number 
                  
              WHERE 
                pi.on_hand_lbs <> 0 
                AND ms.byproduct_type IS NULL 
                AND ms.item_type = ${'FG'} 
                AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                AND pi.location_type <> ${'IN TRANSIT'} 
                ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
                ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
                ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
                ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
                ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
                ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
                ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
                ) 
              AS all_inven
                   
          LEFT OUTER JOIN (
              SELECT ti.location, ti.item_num AS item, ti.lot, SUM(ti.weight) AS lbs, SUM(ti.cost * ti.weight) AS cost_ext 
                  
              FROM "salesReporting".tagged_inventory AS ti 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = ti.item_num   
                  
              WHERE 
                ms.byproduct_type IS NULL 
                AND ms.item_type = ${'FG'} 
                AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
                ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
                ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
                ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
                ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
                ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
                ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
                ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}

              GROUP BY ti.location, ti.item_num, ti.lot) 
              AS tagged_inven 
              
          ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getFgAtLoc_tagged_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.queryLevel} Detail: query postgres for FG at location TAGGED ...`)

    const response = await sql
          `SELECT pi.receipt_date, pi.location_date, pi.lot_text, pi.msc_cert_bool AS msc, ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country, ms.fg_fresh_frozen AS fresh_frozen 
              
          FROM "salesReporting".tagged_inventory AS ti 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = ti.item_num 
              LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                  ON loc.location_code = ti.location
              LEFT OUTER JOIN "invenReporting".perpetual_inventory AS pi
                  ON pi.item_number = ti.item_num AND pi.lot = ti.lot AND pi.location_code = ti.location
          
          WHERE 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getFgInven_detail = getFgInven_detail
module.exports.getFgInTransit_detail = getFgInTransit_detail
module.exports.getFgAtLoc_detail = getFgAtLoc_detail
module.exports.getFgAtLoc_untagged_detail = getFgAtLoc_untagged_detail
module.exports.getFgAtLoc_tagged_detail = getFgAtLoc_tagged_detail
