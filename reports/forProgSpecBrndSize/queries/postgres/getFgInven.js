/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)

const lvl_1_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG on hand ...`)

    // level 1 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.species',
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

const lvl_1_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND ms.program = $3 GROUP BY ms.species',
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

const lvl_1_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND ms.program = $3 GROUP BY ms.species',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_untagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
 'SELECT \'FG ON HAND UNTAGGED\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3 GROUP BY ms.species', ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_tagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 1: query postgres for FG at location TAGGED...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND TAGGED\' AS column, ms.species AS l1_subtotal, \'SUBTOTAL\' AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 GROUP BY ms.species',
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
const lvl_2_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand',
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

const lvl_2_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND ms.program = $3 GROUP BY ms.species, ms.brand',
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

const lvl_2_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND ms.program = $3 GROUP BY ms.species, ms.brand',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc_untagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
 'SELECT \'FG ON HAND UNTAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3 GROUP BY ms.species, ms.brand', ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc_tagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 2: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND TAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, \'SUBTOTAL\' AS l3_subtotal, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand',
      ['FG', program]
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
const lvl_3_subtotal_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG on hand ...`)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand, ms.size_name',
      ['FG', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = $2 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> $2 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name',
      ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_untagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
 'SELECT \'FG ON HAND UNTAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3 GROUP BY ms.species, ms.brand, ms.size_name', ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_tagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND TAGGED\' AS column, ms.species AS l1_subtotal, ms.brand AS l2_subtotal, ms.size_name AS l3_subtotal, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2 GROUP BY ms.species, ms.brand, ms.size_name',
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

const lvl_0_total_getFgInven = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await pgClient.query(
      'SELECT \'FG INVEN\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2',
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

const lvl_0_total_getFgInTransit = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG in transit ...`)

    const response = await pgClient.query(
      'SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND perpetual_inventory.location_type = $3',
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

const lvl_0_total_getFgAtLoc = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG at location ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = $2 AND perpetual_inventory.location_type <> $3',
      ['FG', program, 'IN TRANSIT']
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_untagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG at location UNTAGGED ...`)

    const response = await pgClient.query(
 'SELECT \'FG ON HAND UNTAGGED\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs FROM (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code FROM "invenReporting".perpetual_inventory AS pi WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> $2) AS inven_t LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = inven_t.item_number LEFT OUTER JOIN (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost FROM "salesReporting".tagged_inventory AS ti WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND ms.program = $3', ['FG', 'IN TRANSIT', program]
    ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_tagged = async program => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`level 0: query postgres for FG at location TAGGED ...`)

    const response = await pgClient.query(
      'SELECT \'FG ON HAND TAGGED\' AS column, \'FG SALES\' AS l1_subtotal, \'TOTAL\' AS l2_subtotal, \'TOTAL\' AS l3_subtotal, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num WHERE ms.byproduct_type IS NULL AND ms.item_type = $1 AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = $2',
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

module.exports.lvl_3_subtotal_getFgInven = lvl_3_subtotal_getFgInven
module.exports.lvl_3_subtotal_getFgInTransit = lvl_3_subtotal_getFgInTransit
module.exports.lvl_3_subtotal_getFgAtLoc = lvl_3_subtotal_getFgAtLoc
module.exports.lvl_2_subtotal_getFgInven = lvl_2_subtotal_getFgInven
module.exports.lvl_2_subtotal_getFgInTransit = lvl_2_subtotal_getFgInTransit
module.exports.lvl_2_subtotal_getFgAtLoc = lvl_2_subtotal_getFgAtLoc
module.exports.lvl_1_subtotal_getFgInven = lvl_1_subtotal_getFgInven
module.exports.lvl_1_subtotal_getFgInTransit = lvl_1_subtotal_getFgInTransit
module.exports.lvl_1_subtotal_getFgAtLoc = lvl_1_subtotal_getFgAtLoc
module.exports.lvl_0_total_getFgInven = lvl_0_total_getFgInven
module.exports.lvl_0_total_getFgInTransit = lvl_0_total_getFgInTransit
module.exports.lvl_0_total_getFgAtLoc = lvl_0_total_getFgAtLoc
module.exports.lvl_3_subtotal_getFgAtLoc_untagged = lvl_3_subtotal_getFgAtLoc_untagged
module.exports.lvl_3_subtotal_getFgAtLoc_tagged = lvl_3_subtotal_getFgAtLoc_tagged
module.exports.lvl_0_total_getFgAtLoc_untagged = lvl_0_total_getFgAtLoc_untagged
module.exports.lvl_0_total_getFgAtLoc_tagged = lvl_0_total_getFgAtLoc_tagged
module.exports.lvl_1_subtotal_getFgAtLoc_untagged = lvl_1_subtotal_getFgAtLoc_untagged
module.exports.lvl_1_subtotal_getFgAtLoc_tagged = lvl_1_subtotal_getFgAtLoc_tagged
module.exports.lvl_2_subtotal_getFgAtLoc_untagged = lvl_2_subtotal_getFgAtLoc_untagged
module.exports.lvl_2_subtotal_getFgAtLoc_tagged = lvl_2_subtotal_getFgAtLoc_tagged
