/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)

const lvl_1_subtotal_getFgInven_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG on hand ...`)

    // level 1 detail

    const response = await pgClient.query(
        'SELECT \'FG INVEN\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.species',
        ['FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_1_subtotal_getFgInTransit_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG in transit ...`)

    const response = await pgClient.query(
        'SELECT \'FG IN TRANSIT\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND ms.program = $3 GROUP BY ms.species',
        ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_1_subtotal_getFgAtLoc_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location ...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND ms.program = $3 GROUP BY ms.species',
        ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_untagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
   'SELECT \'FG ON HAND UNTAGGED\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3 GROUP BY ms.species', ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_tagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location TAGGED...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND TAGGED\' AS column, ms.species AS l1_label, \'SUBTOTAL\' AS l2_label, \'SUBTOTAL\' AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 GROUP BY ms.species',
        ['FG', program]
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
        'SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country FROM "invenReporting".perpetual_inventory AS pi LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = pi.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND ms.species = $3 AND ms.brand = $4',
        ['FG', program, filters[0], filters[1]]
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
        'SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country FROM "invenReporting".perpetual_inventory AS pi LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = pi.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type = $2 AND ms.program = $3 AND ms.species = $4 AND ms.brand = $5',
        ['FG', 'IN TRANSIT', program, filters[0], filters[1]]
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
        'SELECT pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country FROM "invenReporting".perpetual_inventory AS pi LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = pi.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.program = $3 AND ms.species = $4 AND ms.brand = $5',
        ['FG', 'IN TRANSIT', program, filters[0], filters[1]]
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
        `SELECT all_inven.item, all_inven.description, all_inven.lot, all_inven.species, all_inven.brand, all_inven.size, all_inven.soak, all_inven.lbs - COALESCE(tagged_inven.lbs,0) AS lbs, all_inven.cost_lb, all_inven.cost_ext - COALESCE(tagged_inven.cost_ext,0) AS cost_ext, all_inven.location, all_inven.country 
        
        FROM (
            SELECT pi.location_code, pi.item_number AS item, pi.description, pi.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, pi.on_hand_lbs AS lbs, pi.cost_lb,  pi.cost_extended AS cost_ext, pi.location_name AS location, pi.location_country as country 
                FROM "invenReporting".perpetual_inventory AS pi 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pi.item_number 
                WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM            "invenReporting".perpetual_inventory) AND pi.location_type <> $2 AND ms.program = $3 AND ms.species = $4 AND ms.brand = $5) 
            AS all_inven
                 
        LEFT OUTER JOIN (
            SELECT ti.location, ti.item_num AS item, ti.lot, ti.weight AS lbs, ti.cost * ti.weight AS cost_ext 
                FROM "salesReporting".tagged_inventory AS ti 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = ti.item_num   
                WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $3 AND ms.species = $4 AND ms.brand = $5) 
            AS tagged_inven 
            
        ON all_inven.item = tagged_inven.item AND all_inven.lot = tagged_inven.lot AND all_inven.location_code = tagged_inven.location`, ['FG', 'IN TRANSIT', program, filters[0], filters[1]]
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
        `SELECT ti.item_num AS item, ms.description, ti.lot, ms.species, ms.brand, ms.size_name AS size, ms.fg_treatment AS soak, ti.weight AS lbs, ti.cost AS cost_lb, ti.cost * ti.weight AS cost_ext, loc.seasoft_name AS location, loc.seasoft_country as country 
            FROM "salesReporting".tagged_inventory AS ti 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = ti.item_num 
                LEFT OUTER JOIN "invenReporting".location_supplement AS loc 
                    ON loc.location_code = ti.location  
            WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ti.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 AND ms.species = $3 AND ms.brand = $4`,
        ['FG', program, filters[0], filters[1]]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG on hand (includes in transit)
const lvl_3_subtotal_getFgInven_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG on hand ...`)

    const response = await pgClient.query(
        'SELECT \'FG INVEN\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand, ms.size_name',
        ['FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgInTransit_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG in transit ...`)

    const response = await pgClient.query(
        'SELECT \'FG IN TRANSIT\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name',
        ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name',
        ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_untagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
   'SELECT \'FG ON HAND UNTAGGED\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name', ['FG', 'IN TRANSIT', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_tagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND TAGGED\' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand, ms.size_name',
        ['FG', program]
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

    console.log(`level 0: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await pgClient.query(
        'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2',
        ['FG', program]
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

    console.log(`level 0: query postgres for FG in transit ...`)

    const response = await pgClient.query(
        'SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND perpetual_inventory.location_type = $3',
        ['FG', program, 'IN TRANSIT']
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

    console.log(`level 0: query postgres for FG at location ...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND perpetual_inventory.location_type <> $3',
        ['FG', program, 'IN TRANSIT']
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_untagged_detail = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
   'SELECT \'FG ON HAND UNTAGGED\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3', ['FG', 'IN TRANSIT', program]
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

    console.log(`level 0: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
        'SELECT \'FG ON HAND TAGGED\' AS column, \'FG SALES\' AS l1_label, \'TOTAL\' AS l2_label, \'TOTAL\' AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2',
        ['FG', program]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

// MOVE tagged and untagged to own files. This is a mess.

module.exports.lvl_3_subtotal_getFgInven_detail = lvl_3_subtotal_getFgInven_detail
module.exports.lvl_3_subtotal_getFgInTransit_detail = lvl_3_subtotal_getFgInTransit_detail
module.exports.lvl_3_subtotal_getFgAtLoc_detail = lvl_3_subtotal_getFgAtLoc_detail
module.exports.lvl_2_subtotal_getFgInven_detail = lvl_2_subtotal_getFgInven_detail
module.exports.lvl_2_subtotal_getFgInTransit_detail = lvl_2_subtotal_getFgInTransit_detail
module.exports.lvl_2_subtotal_getFgAtLoc_detail = lvl_2_subtotal_getFgAtLoc_detail
module.exports.lvl_1_subtotal_getFgInven_detail = lvl_1_subtotal_getFgInven_detail
module.exports.lvl_1_subtotal_getFgInTransit_detail = lvl_1_subtotal_getFgInTransit_detail
module.exports.lvl_1_subtotal_getFgAtLoc_detail = lvl_1_subtotal_getFgAtLoc_detail
module.exports.lvl_0_total_getFgInven_detail = lvl_0_total_getFgInven_detail
module.exports.lvl_0_total_getFgInTransit_detail = lvl_0_total_getFgInTransit_detail
module.exports.lvl_0_total_getFgAtLoc_detail = lvl_0_total_getFgAtLoc_detail
module.exports.lvl_3_subtotal_getFgAtLoc_untagged_detail = lvl_3_subtotal_getFgAtLoc_untagged_detail
module.exports.lvl_3_subtotal_getFgAtLoc_tagged_detail = lvl_3_subtotal_getFgAtLoc_tagged_detail
module.exports.lvl_0_total_getFgAtLoc_untagged_detail = lvl_0_total_getFgAtLoc_untagged_detail
module.exports.lvl_0_total_getFgAtLoc_tagged_detail = lvl_0_total_getFgAtLoc_tagged_detail
module.exports.lvl_1_subtotal_getFgAtLoc_untagged_detail = lvl_1_subtotal_getFgAtLoc_untagged_detail
module.exports.lvl_1_subtotal_getFgAtLoc_tagged_detail = lvl_1_subtotal_getFgAtLoc_tagged_detail
module.exports.lvl_2_subtotal_getFgAtLoc_untagged_detail = lvl_2_subtotal_getFgAtLoc_untagged_detail
module.exports.lvl_2_subtotal_getFgAtLoc_tagged_detail = lvl_2_subtotal_getFgAtLoc_tagged_detail
