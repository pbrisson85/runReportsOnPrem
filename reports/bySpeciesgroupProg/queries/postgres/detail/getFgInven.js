/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)
const lvl_1_subtotal_getFgInven_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1 Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
          `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.species_group = $2`,
          ['FG', filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_1_subtotal_getFgInTransit_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1 Detail: query postgres for FG in transit ...`)

    const response = await pgClient.query(
          `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type = $2 AND ms.species_group = $3`,
          ['FG', 'IN TRANSIT', filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_1_subtotal_getFgAtLoc_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1 Detail: query postgres for FG at location ...`)

    const response = await pgClient.query(
          `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
              
          WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.species_group = $3`,
          ['FG', 'IN TRANSIT', filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// Going to need to revisit this one
const lvl_1_subtotal_getFgAtLoc_untagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1 Detail: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
          `SELECT all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country, all_inven.fresh_frozen
          
          FROM (
              SELECT pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
                  FROM "invenReporting".perpetual_inventory AS pi 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = pi.item_number 
                  WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 
                  FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.species_group = $3) 
                  AS all_inven
                   
          LEFT OUTER JOIN (
              SELECT ti.location, ti.item_num AS item, ti.lot, SUM(ti.weight) AS lbs, SUM(ti.cost * ti.weight) AS cost_ext 
                  FROM "salesReporting".tagged_inventory AS ti 
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = ti.item_num   
                  WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.species_group = $3
                  GROUP BY ti.location, ti.item_num, ti.lot) 
              AS tagged_inven 
              
          ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location`, ['FG', 'IN TRANSIT', filters[0]]
             ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_tagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1 Detail: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
          `SELECT ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country, ms.fg_fresh_frozen AS fresh_frozen 
              
          FROM "salesReporting".tagged_inventory AS ti 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = ti.item_num 
              LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                  ON loc.location_code = ti.location  
          
          WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.species_group = $2`,
          ['FG', filters[0]]
        ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG on hand (includes in transit)
const lvl_2_subtotal_getFgInven_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2 Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
        `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen
        
        FROM "invenReporting".perpetual_inventory AS pi 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = pi.item_number 
            
        WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.species_group = $2 AND ms.program = $3`,
        ['FG', filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_2_subtotal_getFgInTransit_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2 Detail: query postgres for FG in transit ...`)

    const response = await pgClient.query(
        `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
        
        FROM "invenReporting".perpetual_inventory AS pi 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = pi.item_number 
            
        WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type = $2 AND ms.species_group = $3 AND ms.program = $4`,
        ['FG', 'IN TRANSIT', filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_2_subtotal_getFgAtLoc_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2 Detail: query postgres for FG at location ...`)

    const response = await pgClient.query(
        `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
        
        FROM "invenReporting".perpetual_inventory AS pi 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = pi.item_number 
            
        WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.species_group = $3 AND ms.program = $4`,
        ['FG', 'IN TRANSIT', filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// Going to need to revisit this one
const lvl_2_subtotal_getFgAtLoc_untagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2 Detail: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
        `SELECT all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country, all_inven.fresh_frozen 
        
        FROM (
            SELECT pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
                
            FROM "invenReporting".perpetual_inventory AS pi 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pi.item_number 
                
            WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.species_group = $3 AND ms.program = $4) 
            
            AS all_inven
                 
        LEFT OUTER JOIN (
            SELECT ti.location, ti.item_num AS item, ti.lot, SUM(ti.weight) AS lbs, SUM(ti.cost * ti.weight) AS cost_ext 
                
            FROM "salesReporting".tagged_inventory AS ti 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = ti.item_num   
            
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.species_group = $3 AND ms.program = $4
            GROUP BY ti.location, ti.item_num, ti.lot)   
            AS tagged_inven 
            
        ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location`, ['FG', 'IN TRANSIT', filters[0], filters[1]]
           ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc_tagged_detail = async (program, filters) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2 Detail: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
        `SELECT ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country, ms.fg_fresh_frozen AS fresh_frozen 
        
        FROM "salesReporting".tagged_inventory AS ti 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = ti.item_num 
            LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                ON loc.location_code = ti.location  
        
        WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.species_group = $2 AND ms.program = $3`,
        ['FG', filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// FG on hand (includes in transit)
const lvl_0_total_getFgInven_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0 Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
            `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
            
            FROM "invenReporting".perpetual_inventory AS pi 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pi.item_number 
                
            WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)`,
            ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_0_total_getFgInTransit_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0 Detail: query postgres for FG in transit ...`)

    const response = await pgClient.query(
            `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
            
            FROM "invenReporting".perpetual_inventory AS pi 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pi.item_number 
                
            WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type = $2`,
            ['FG', 'IN TRANSIT']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_0_total_getFgAtLoc_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0 Detail: query postgres for FG at location ...`)

    const response = await pgClient.query(
            `SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen 
            
            FROM "invenReporting".perpetual_inventory AS pi 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pi.item_number 
                
            WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2`,
            ['FG', 'IN TRANSIT']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// Going to need to revisit this one
const lvl_0_total_getFgAtLoc_untagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0 Detail: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
            `SELECT all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country, all_inven.fresh_frozen 
            
            FROM (
                SELECT pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country, ms.fg_fresh_frozen AS fresh_frozen
                    
                FROM "invenReporting".perpetual_inventory AS pi 
                    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                        ON ms.item_num = pi.item_number 
                    
                WHERE pi.on_hand_lbs <> 0 AND ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2) 
                AS all_inven
                     
            LEFT OUTER JOIN (
                SELECT ti.location, ti.item_num AS item, ti.lot, SUM(ti.weight) AS lbs, SUM(ti.cost * ti.weight) AS cost_ext 
                    
                FROM "salesReporting".tagged_inventory AS ti 
                    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                        ON ms.item_num = ti.item_num   
                    
                WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory)
                GROUP BY ti.location, ti.item_num, ti.lot)  
                AS tagged_inven 
                
            ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location`, ['FG', 'IN TRANSIT']
               ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_tagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0 Detail: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
            `SELECT ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country, ms.fg_fresh_frozen AS fresh_frozen 
                
            FROM "salesReporting".tagged_inventory AS ti 
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                  ON ms.item_num = ti.item_num 
              LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                  ON loc.location_code = ti.location  
                
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory)`,
            ['FG']
          ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_2_subtotal_getFgInven_detail = lvl_2_subtotal_getFgInven_detail
module.exports.lvl_2_subtotal_getFgInTransit_detail = lvl_2_subtotal_getFgInTransit_detail
module.exports.lvl_2_subtotal_getFgAtLoc_detail = lvl_2_subtotal_getFgAtLoc_detail
module.exports.lvl_1_subtotal_getFgInven_detail = lvl_1_subtotal_getFgInven_detail
module.exports.lvl_1_subtotal_getFgInTransit_detail = lvl_1_subtotal_getFgInTransit_detail
module.exports.lvl_1_subtotal_getFgAtLoc_detail = lvl_1_subtotal_getFgAtLoc_detail
module.exports.lvl_0_total_getFgInven_detail = lvl_0_total_getFgInven_detail
module.exports.lvl_0_total_getFgInTransit_detail = lvl_0_total_getFgInTransit_detail
module.exports.lvl_0_total_getFgAtLoc_detail = lvl_0_total_getFgAtLoc_detail
module.exports.lvl_0_total_getFgAtLoc_untagged_detail = lvl_0_total_getFgAtLoc_untagged_detail
module.exports.lvl_0_total_getFgAtLoc_tagged_detail = lvl_0_total_getFgAtLoc_tagged_detail
module.exports.lvl_1_subtotal_getFgAtLoc_untagged_detail = lvl_1_subtotal_getFgAtLoc_untagged_detail
module.exports.lvl_1_subtotal_getFgAtLoc_tagged_detail = lvl_1_subtotal_getFgAtLoc_tagged_detail
module.exports.lvl_2_subtotal_getFgAtLoc_untagged_detail = lvl_2_subtotal_getFgAtLoc_untagged_detail
module.exports.lvl_2_subtotal_getFgAtLoc_tagged_detail = lvl_2_subtotal_getFgAtLoc_tagged_detail
