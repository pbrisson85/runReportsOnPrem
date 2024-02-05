const sql = require('../../../../server')

// FG on hand (includes in transit)
const getInven_detail = async config => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel} Detail: query postgres for FG on hand ...`)

    // Level 2 detail

    const response = await sql
          `
          WITH tagged_inven AS (
            SELECT
            SUM(t.weight) AS tagged_lbs,
            t.lot,
            t.item_num,
            t.location

            FROM
              "salesReporting".tagged_inventory AS t

            WHERE
              t.version = (SELECT MAX(version) FROM "salesReporting".tagged_inventory)

            GROUP BY
              t.lot,
              t.item_num,
              t.location
          )

          
          SELECT 
            COALESCE(ti.tagged_lbs,0) AS tagged_lbs,
            pi.on_hand_lbs - COALESCE(ti.tagged_lbs,0) AS untagged_lbs,
            pi.receipt_date, 
            pi.location_date, 
            pi.lot_text, 
            pi.msc_cert_bool AS msc, 
            pi.item_number AS item, 
            pi.description, 
            pi.lot, 
            ms.species, 
            ms.brand, 
            ms.size_name AS size, 
            ms.fg_treatment AS soak, 
            pi.on_hand_lbs AS lbs, 
            pi.cost_lb,  
            pi.cost_extended AS cost_ext, 
            pi.location_name AS location, 
            pi.location_code AS location_code,
            pi.location_country as country, 
            ms.fg_fresh_frozen AS fresh_frozen 
          
          FROM "invenReporting".perpetual_inventory AS pi 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pi.item_number 
            LEFT OUTER JOIN tagged_inven AS ti
              ON pi.item_number = ti.item_num
                AND pi.lot = ti.lot
                AND pi.location_code = ti.location
              
          WHERE 
            pi.on_hand_lbs <> 0 
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``}

            ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
            ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
            ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
            ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
            ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` }
            
            ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
            
            
            
            
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

module.exports.getInven_detail = getInven_detail
