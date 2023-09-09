const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

// RM on hand grouped by species (includes in transit)

const l1_getRmInven = async program => {
  try {
    console.log(`${config.user} - level 1: query postgres for RM on hand ...`)

    const response =
      await sql
      `SELECT 'RM INVEN' AS column, ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
      
      GROUP BY ms.species` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by species (INCLUDES OUT OF COUNTRY!!!!!)

const l1_getRmInTransit = async program => {
  try {
    console.log(`${config.user} - level 1: query postgres for RM in transit ...`)

    const response =
      await sql
      `SELECT 'RM IN TRANSIT' AS column, ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = ${'IN TRANSIT'} OR perpetual_inventory.location_country <> perpetual_inventory.program_country) AND ms.program = ${program} 
      
      GROUP BY ms.species` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by species (EXCLUDES OUT OF COUNTRY!!!!!)

const l1_getRmAtLoc = async program => {
  try {
    console.log(`${config.user} - level 1: query postgres for RM at loc ...`)

    const response =
      await sql
      `SELECT 'RM ON HAND' AS column, ms.species AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} AND perpetual_inventory.location_country = perpetual_inventory.program_country AND ms.program = ${program} 
      
      GROUP BY ms.species` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// RM on hand grouped by program

const l2_getRmInven = async program => {
  try {
    console.log(`${config.user} - level 2: query postgres for RM on hand ...`)

    const response =
      await sql
      `SELECT 'RM INVEN' AS column, ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by program (INCLUDES OUT OF COUNTRY!!!!!)

const l2_getRmInTransit = async program => {
  try {
    console.log(`${config.user} - level 2: query postgres for RM in transit ...`)

    const response =
      await sql
      `SELECT 'RM IN TRANSIT' AS column, ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = ${'IN TRANSIT'} OR perpetual_inventory.location_country <> perpetual_inventory.program_country) AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by program (EXCLUDES OUT OF COUNTRY!!!!!)

const l2_getRmAtLoc = async program => {
  try {
    console.log(`${config.user} - level 2: query postgres for RM at location ...`)

    const response =
      await sql
      `SELECT 'RM ON HAND' AS column, ms.species AS l1_label, ms.brand AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} AND perpetual_inventory.location_country = perpetual_inventory.program_country AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// RM on hand grouped by program

const l3_getRmInven = async program => {
  try {
    console.log(`${config.user} - level 3: query postgres for RM on hand ...`)

    const response =
      await sql
      `SELECT 'RM INVEN' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by program (INCLUDES OUT OF COUNTRY!!!!!)

const l3_getRmInTransit = async program => {
  try {
    console.log(`${config.user} - level 3: query postgres for RM in transit ...`)

    const response =
      await sql
      `SELECT 'RM IN TRANSIT' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = ${'IN TRANSIT'} OR perpetual_inventory.location_country <> perpetual_inventory.program_country) AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by program (EXCLUDES OUT OF COUNTRY!!!!!)

const l3_getRmAtLoc = async program => {
  try {
    console.log(`${config.user} - level 3: query postgres for RM at location ...`)

    const response =
      await sql
      `SELECT 'RM ON HAND' AS column, ms.species AS l1_label, ms.brand AS l2_label, ms.size_name AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} AND perpetual_inventory.location_country = perpetual_inventory.program_country AND ms.program = ${program} 
      
      GROUP BY ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// RM on hand grouped by species (includes in transit)

const l0_getRmInven = async program => {
  try {
    console.log(`${config.user} - level 0: query postgres for RM on hand ...`)

    const response =
      await sql
      `SELECT 'RM INVEN' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM in transit grouped by species (INCLUDES OUT OF COUNTRY!!!!!)

const l0_getRmInTransit = async program => {
  try {
    console.log(`${config.user} - level 0: query postgres for RM in transit ...`)

    const response =
      await sql
      `SELECT 'RM IN TRANSIT' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND (perpetual_inventory.location_type = ${'IN TRANSIT'} OR perpetual_inventory.location_country <> perpetual_inventory.program_country) AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// RM at location grouped by species (EXCLUDES OUT OF COUNTRY!!!!!)

const l0_getRmAtLoc = async program => {
  try {
    console.log(`${config.user} - level 0: query postgres for RM at location ...`)

    const response =
      await sql
      `SELECT 'RM ON HAND' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'RM'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} AND perpetual_inventory.location_country = perpetual_inventory.program_country AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l3_getRmInven = l3_getRmInven
module.exports.l3_getRmInTransit = l3_getRmInTransit
module.exports.l3_getRmAtLoc = l3_getRmAtLoc
module.exports.l2_getRmInven = l2_getRmInven
module.exports.l2_getRmInTransit = l2_getRmInTransit
module.exports.l2_getRmAtLoc = l2_getRmAtLoc
module.exports.l1_getRmInven = l1_getRmInven
module.exports.l1_getRmInTransit = l1_getRmInTransit
module.exports.l1_getRmAtLoc = l1_getRmAtLoc
module.exports.l0_getRmInven = l0_getRmInven
module.exports.l0_getRmInTransit = l0_getRmInTransit
module.exports.l0_getRmAtLoc = l0_getRmAtLoc
