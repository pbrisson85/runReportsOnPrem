const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

// FG on hand (includes in transit)

const lvl_1_subtotal_getFgInven = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG on hand ...`)

    // level 1 detail

    const response = await sql
      `SELECT 'FG INVEN' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_1_subtotal_getFgInTransit = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT 'FG IN TRANSIT' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_1_subtotal_getFgAtLoc = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG at location ...`)

    const response = await sql
      `SELECT 'FG ON HAND' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_untagged = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT 'FG ON HAND UNTAGGED' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
  SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
    FROM "invenReporting".perpetual_inventory AS pi 
    WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) AS inven_t 
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
        SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
        
        FROM "salesReporting".tagged_inventory AS ti 
        
        WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
        
        GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
    
    WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
    
    GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_1_subtotal_getFgAtLoc_tagged = async (config, program) => {
  try {
    console.log(`level 1: query postgres for FG at location TAGGED...`)

    const response = await sql
      `SELECT 'FG ON HAND TAGGED' AS column, ${sql(config.l1_field)} AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG on hand (includes in transit)
const lvl_2_subtotal_getFgInven = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await sql
      `SELECT 'FG INVEN' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_2_subtotal_getFgInTransit = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT 'FG IN TRANSIT' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_2_subtotal_getFgAtLoc = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG at location ...`)

    const response = await sql
      `SELECT 'FG ON HAND' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc_untagged = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT 'FG ON HAND UNTAGGED' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      
      FROM "invenReporting".perpetual_inventory AS pi 
      
      WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) AS inven_t 
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = inven_t.item_number 
      
  LEFT OUTER JOIN (
          SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
          
          FROM "salesReporting".tagged_inventory AS ti 
          
          WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
          
          GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
          
      ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
  
  WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
  
  GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_2_subtotal_getFgAtLoc_tagged = async (config, program) => {
  try {
    console.log(`level 2: query postgres for FG at location TAGGED ...`)

    const response = await sql
      `SELECT 'FG ON HAND TAGGED' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, 'SUBTOTAL' AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG on hand (includes in transit)
const lvl_3_subtotal_getFgInven = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG on hand ...`)

    const response = await sql
      `SELECT 'FG INVEN' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgInTransit = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT 'FG IN TRANSIT' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type = ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await sql
      `SELECT 'FG ON HAND' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) AND perpetual_inventory.location_type <> ${'IN TRANSIT'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_untagged = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT 'FG ON HAND UNTAGGED' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
      WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) 
      AS inven_t 
      
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
      SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) 
      AS tagged_t 
      
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_3_subtotal_getFgAtLoc_tagged = async (config, program) => {
  try {
    console.log(`level 3: query postgres for FG at location TAGGED ...`)

    const response = await sql
      `SELECT 'FG ON HAND TAGGED' AS column, ${sql(config.l1_field)} AS l1_label, ${sql(config.l2_field)} AS l2_label, ${sql(config.l3_field)} AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// FG on hand (includes in transit)

const lvl_0_total_getFgInven = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG on hand ...`)

    // level 0 detail (TOTAL)

    const response = await sql
      `SELECT 'FG INVEN' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG in transit

const lvl_0_total_getFgInTransit = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG in transit ...`)

    const response = await sql
      `SELECT 'FG IN TRANSIT' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} AND perpetual_inventory.location_type = ${'IN TRANSIT'}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// FG at location

const lvl_0_total_getFgAtLoc = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG at location ...`)

    const response = await sql
      `SELECT 'FG ON HAND' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} AND perpetual_inventory.location_type <> ${'IN TRANSIT'}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_untagged = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG at location UNTAGGED ...`)

    const response = await sql
 `SELECT 'FG ON HAND UNTAGGED' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
        WHERE pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) AND pi.location_type <> ${'IN TRANSIT'}) AS   inven_t 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
        ON ms.item_num = inven_t.item_number 
        
  LEFT OUTER JOIN (
        SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
        FROM "salesReporting".tagged_inventory AS ti 
        WHERE ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
        GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
  WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const lvl_0_total_getFgAtLoc_tagged = async (config, program) => {
  try {
    console.log(`level 0: query postgres for FG at location TAGGED ...`)

    const response = await sql
    `SELECT 'FG ON HAND TAGGED' AS column, 'FG SALES' AS l1_label, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
    
    FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
    
    WHERE ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) ${program ? sql`AND ms.program = ${program}`: sql``} ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
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
