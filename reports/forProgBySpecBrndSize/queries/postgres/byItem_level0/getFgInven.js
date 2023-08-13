/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)

const lvl_1_subtotal_getFgInven = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG on hand ...`)

    // level 1 detail

    const response = await sql
      `SELECT \'FG INVEN\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.species AS l3_label, ms.brand AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} 
      
      GROUP BY ms.item_num, ms.description, ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_1_subtotal_getFgInTransit = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT \'FG IN TRANSIT\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.species AS l3_label, ms.brand AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = ${'IN TRANSIT'} AND ms.program = ${program}
      
      GROUP BY ms.item_num, ms.description, ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_1_subtotal_getFgAtLoc = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG at location ...`)

    const response = await sql
      `SELECT \'FG ON HAND\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.species AS l3_label, ms.brand AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} AND ms.program = ${program}
      
      GROUP BY ms.item_num, ms.description, ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_untagged = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT \'FG ON HAND UNTAGGED\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.species AS l3_label, ms.brand AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM 
  (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
    FROM "invenReporting".perpetual_inventory AS pi 
    WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) 
    AS inven_t 
    
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN 
    (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) 
      AS tagged_t 
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
    
  WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program} 
  GROUP BY ms.item_num, ms.description, ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_tagged = async (config, program, filters) => {
  try {
    console.log(`level 1: query postgres for FG at location TAGGED...`)

    const response = await sql
      `SELECT \'FG ON HAND TAGGED\' AS column, ms.item_num AS l1_label, ms.description AS l2_label, ms.species AS l3_label, ms.brand AS l4_label , ms.size_name AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = tagged_inventory.item_num 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = ${program} 
      GROUP BY ms.item_num, ms.description, ms.species, ms.brand, ms.size_name` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// FG on hand (includes in transit)

const lvl_0_total_getFgInven = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await sql
      `SELECT \'FG INVEN\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_0_total_getFgInTransit = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT \'FG IN TRANSIT\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} AND perpetual_inventory.location_type = ${'IN TRANSIT'}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_0_total_getFgAtLoc = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG at location ...`)

    const response = await sql
      `SELECT \'FG ON HAND\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND ms.program = ${program} AND perpetual_inventory.location_type <> ${'IN TRANSIT'}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_untagged = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT \'FG ON HAND UNTAGGED\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM 
  (SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
    FROM "invenReporting".perpetual_inventory AS pi 
    WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) 
    AS inven_t 
    
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN 
    (SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
      ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
      
  WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_tagged = async (config, program, filters) => {
  try {
    console.log(`level 0: query postgres for FG at location TAGGED ...`)

    const response = await sql
      `SELECT \'FG ON HAND TAGGED\' AS column, \'FG SALES\' AS l1_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = tagged_inventory.item_num 
          
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) AND ms.program = ${program}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.lvl_1_subtotal_getFgInven = lvl_1_subtotal_getFgInven
module.exports.lvl_1_subtotal_getFgInTransit = lvl_1_subtotal_getFgInTransit
module.exports.lvl_1_subtotal_getFgAtLoc = lvl_1_subtotal_getFgAtLoc
module.exports.lvl_0_total_getFgInven = lvl_0_total_getFgInven
module.exports.lvl_0_total_getFgInTransit = lvl_0_total_getFgInTransit
module.exports.lvl_0_total_getFgAtLoc = lvl_0_total_getFgAtLoc
module.exports.lvl_0_total_getFgAtLoc_untagged = lvl_0_total_getFgAtLoc_untagged
module.exports.lvl_0_total_getFgAtLoc_tagged = lvl_0_total_getFgAtLoc_tagged
module.exports.lvl_1_subtotal_getFgAtLoc_untagged = lvl_1_subtotal_getFgAtLoc_untagged
module.exports.lvl_1_subtotal_getFgAtLoc_tagged = lvl_1_subtotal_getFgAtLoc_tagged
