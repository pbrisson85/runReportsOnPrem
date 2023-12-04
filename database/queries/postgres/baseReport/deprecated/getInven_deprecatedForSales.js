const sql = require('../../../../../server')

/* *********************************************** Level 1 *********************************************** */

// Inv in transit

const l1_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for Inv in transit (l1_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv at location

const l1_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for Inv at location (l1_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for Inv at location UNTAGGED (l1_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
  SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
    FROM "invenReporting".perpetual_inventory AS pi 
    WHERE 
      pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
      AND pi.location_type <> ${'IN TRANSIT'}) 
    AS inven_t 
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
        SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
        
        FROM "salesReporting".tagged_inventory AS ti 
        
        WHERE 
          ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
        
        GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
    
    WHERE 
      ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
    
    GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 1: query postgres for Inv at location TAGGED (l1_getInvAtLoc_tagged) ...`)

    const response = await sql
      `SELECT 'INV INV ON HAND TAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE 
        tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// Inv in transit

const l2_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for Inv in transit (l2_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv at location

const l2_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for Inv at location (l2_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for Inv at location UNTAGGED (l2_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      
      FROM "invenReporting".perpetual_inventory AS pi 
      
      WHERE 
        pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
        AND pi.location_type <> ${'IN TRANSIT'}) 
      AS inven_t 

    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = inven_t.item_number 
      
  LEFT OUTER JOIN (
          SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
          
          FROM "salesReporting".tagged_inventory AS ti 
          
          WHERE 
            ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
          
          GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
          
      ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
  
  WHERE 
    ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
    ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
    ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
  
  GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 2: query postgres for Inv at location TAGGED (l2_getInvAtLoc_tagged) ...`)

    const response = await sql
      `SELECT 'INV INV ON HAND TAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE 
        tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

const l3_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for Inv in transit (l3_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for Inv at location TAGGED (l3_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for Inv at location UNTAGGED (l3_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
      WHERE 
        pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
        AND pi.location_type <> ${'IN TRANSIT'}) 
      AS inven_t 
      
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
      SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE 
        ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) 
      AS tagged_t 
      
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
      
      WHERE 
        ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 3: query postgres for Inv at location TAGGED (l3_getInvAtLoc_tagged) ...`)

    const response = await sql
      `SELECT 'INV INV ON HAND TAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE 
        tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

const l4_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for Inv in transit (l4_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for Inv at location TAGGED (l4_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for Inv at location UNTAGGED (l4_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
      WHERE 
        pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
        AND pi.location_type <> ${'IN TRANSIT'}) 
      AS inven_t 
      
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
      SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE 
        ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) 
      AS tagged_t 
      
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
      
      WHERE 
        ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 4: query postgres for Inv at location TAGGED (l4_getInvAtLoc_tagged) ...`)

    const response = await sql
      `SELECT 'INV INV ON HAND TAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, 'SUBTOTAL' AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE 
        tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 5 *********************************************** */

const l5_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for Inv in transit (l4_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for Inv at location TAGGED (l4_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'} 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for Inv at location UNTAGGED (l4_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
      WHERE 
        pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
        AND pi.location_type <> ${'IN TRANSIT'}) 
      AS inven_t 
      
  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
    ON ms.item_num = inven_t.item_number 
    
  LEFT OUTER JOIN (
      SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
      FROM "salesReporting".tagged_inventory AS ti 
      WHERE 
        ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
      GROUP BY ti.lot, ti.location, ti.item_num) 
      AS tagged_t 
      
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
      
      WHERE 
        ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 5: query postgres for Inv at location TAGGED (l4_getInvAtLoc_tagged) ...`)

    const response = await sql
      `SELECT 'INV INV ON HAND TAGGED' AS column, COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
      
      FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
      
      WHERE 
        tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
      
      GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

// Inv in transit

const l0_getInvInTransit = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv in transit (l0_getInvInTransit) ...`)

    const response = await sql
      `SELECT 'INV IN TRANSIT' AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type = ${'IN TRANSIT'}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

// Inv at location

const l0_getInvAtLoc = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv at location (l0_getInvAtLoc) ...`)

    const response = await sql
      `SELECT 'INV ON HAND' AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(perpetual_inventory.on_hand_lbs),0) AS lbs, COALESCE(SUM(perpetual_inventory.cost_extended),0) AS cogs 
      
      FROM "invenReporting".perpetual_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = perpetual_inventory.item_number 
      
      WHERE 
        perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
        AND perpetual_inventory.location_type <> ${'IN TRANSIT'}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getInvAtLoc_untagged = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv at location UNTAGGED (l0_getInvAtLoc_untagged) ...`)

    const response = await sql
 `SELECT 'INV INV ON HAND UNTAGGED' AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(inven_t.on_hand_lbs),0) - COALESCE(SUM(tagged_t.weight),0) AS lbs , COALESCE(SUM(inven_t.cost_extended),0) - COALESCE(SUM(tagged_t.ext_cost),0) AS cogs 
 
 FROM (
      SELECT pi.cost_extended, pi.item_number, pi.lot, pi.on_hand_lbs, pi.location_code 
      FROM "invenReporting".perpetual_inventory AS pi 
        WHERE 
          pi .version = (SELECT MAX(subpi.version) - 1 FROM "invenReporting".perpetual_inventory AS subpi) 
          AND pi.location_type <> ${'IN TRANSIT'}) 
        AS inven_t 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
        ON ms.item_num = inven_t.item_number 
        
  LEFT OUTER JOIN (
        SELECT ti.lot, ti.location, ti.item_num, COALESCE(SUM(ti.weight),0) AS weight, COALESCE(SUM(ti.cost * ti.weight),0) AS ext_cost 
        FROM "salesReporting".tagged_inventory AS ti 
        WHERE 
          ti.version = (SELECT MAX(subti.version) - 1 FROM "salesReporting".tagged_inventory AS subti) 
        GROUP BY ti.lot, ti.location, ti.item_num) AS tagged_t 
    ON tagged_t.item_num = inven_t.item_number AND tagged_t.lot = inven_t.lot AND tagged_t.location = inven_t.location_code 
  WHERE 
    ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
    ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
    ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getInvAtLoc_tagged = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for Inv at location TAGGED (l0_getInvAtLoc_tagged) ...`)

    const response = await sql
    `SELECT 'INV INV ON HAND TAGGED' AS column ${config.baseFilters.itemType ? sql`, REPLACE('${sql(config.baseFilters.itemType)} SALES','"','') AS l1_label` : sql`,'SALES' AS l1_label`}, 'TOTAL' AS l2_label, 'TOTAL' AS l3_label, 'TOTAL' AS l4_label, 'TOTAL' AS l5_label, COALESCE(SUM(tagged_inventory.weight),0) AS lbs, COALESCE(SUM(tagged_inventory.cost * tagged_inventory.weight),0) AS cogs 
    
    FROM "salesReporting".tagged_inventory LEFT OUTER JOIN "invenReporting".master_supplement AS ms ON ms.item_num = tagged_inventory.item_num 
    
    WHERE 
      tagged_inventory.version = (SELECT MAX(tagged_inventory.version) - 1 FROM "salesReporting".tagged_inventory) 
      ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.l5_getInvInTransit = l5_getInvInTransit
module.exports.l5_getInvAtLoc = l5_getInvAtLoc
module.exports.l5_getInvAtLoc_untagged = l5_getInvAtLoc_untagged
module.exports.l5_getInvAtLoc_tagged = l5_getInvAtLoc_tagged

module.exports.l4_getInvInTransit = l4_getInvInTransit
module.exports.l4_getInvAtLoc = l4_getInvAtLoc
module.exports.l4_getInvAtLoc_untagged = l4_getInvAtLoc_untagged
module.exports.l4_getInvAtLoc_tagged = l4_getInvAtLoc_tagged

module.exports.l3_getInvInTransit = l3_getInvInTransit
module.exports.l3_getInvAtLoc = l3_getInvAtLoc
module.exports.l3_getInvAtLoc_untagged = l3_getInvAtLoc_untagged
module.exports.l3_getInvAtLoc_tagged = l3_getInvAtLoc_tagged

module.exports.l2_getInvInTransit = l2_getInvInTransit
module.exports.l2_getInvAtLoc = l2_getInvAtLoc
module.exports.l2_getInvAtLoc_untagged = l2_getInvAtLoc_untagged
module.exports.l2_getInvAtLoc_tagged = l2_getInvAtLoc_tagged

module.exports.l1_getInvInTransit = l1_getInvInTransit
module.exports.l1_getInvAtLoc = l1_getInvAtLoc
module.exports.l1_getInvAtLoc_untagged = l1_getInvAtLoc_untagged
module.exports.l1_getInvAtLoc_tagged = l1_getInvAtLoc_tagged

module.exports.l0_getInvInTransit = l0_getInvInTransit
module.exports.l0_getInvAtLoc = l0_getInvAtLoc
module.exports.l0_getInvAtLoc_untagged = l0_getInvAtLoc_untagged
module.exports.l0_getInvAtLoc_tagged = l0_getInvAtLoc_tagged
