const sql = require('../../../../server')

const getProduction_detail = async (config, startDate, endDate, woActivity) => {
  try {
    console.log(`${config.user} - getProduction_detail ...`)

    const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.description, ms2.wo_activity, ms2.wo_group, ms2.program_country, ms2.wo_entity  
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      wo.wo_num,
      ${woActivity} AS wo_activity, 
      wo.wo_activity_code AS wo_activity_code,
      act.description AS wo_activity_description,
      act.wo_entity AS entity,
      act.program_country AS country,
      wo.rm_from_item AS item,
      ms.description,
      wo.rm_location AS location,
      wo.header_classification AS classification,
      wo.header_notes AS notes,
      wo.rm_lot AS lot,                                             -- deleted lot text ********
      wo.formatted_posting_date AS posting_date,
      ms.species, 
      ms.brand, 
      ms.size_name AS size, 
      ms.fg_treatment AS soak, 
      ms.fg_fresh_frozen AS fresh_frozen,  
      COALESCE(wo.fg_rm_line_weight,0) AS fg_lbs,                   -- types menu needs to change to accomodate new naming ********
      COALESCE(wo.rm_line_weight,0) AS rm_lbs,                      -- types menu needs to change to accomodate new naming ********
      COALESCE(wo.chem_rm_line_weight,0) AS chem_lbs,  
      COALESCE(wo.rm_line_cost,0) AS rm_cost,  
      COALESCE(NULLIF(wo.fg_rm_line_weight,0)/NULLIF(wo.rm_line_weight,0),0) AS yield,
      COALESCE(wo.fg_rm_line_cost,0) AS fg_cost,             
      COALESCE(wo.mfg_rm_line_direct_labor,0) AS labor, 
      COALESCE(wo.mfg_rm_line_overhead_pool,0) AS oh, 
      COALESCE(wo.mfg_rm_line_packaging,0) AS packaging, 
      COALESCE(wo.chem_rm_line_cost,0) AS chem, 
      COALESCE(wo.mfg_rm_line_processing_fee,0) AS "processingFee", 
      COALESCE(wo.fg_rm_line_cost/NULLIF(wo.fg_rm_line_weight,0),0) AS "fgCostPerLb",                 -- changed name from costPerLb
      COALESCE(wo.rm_line_cost/NULLIF(wo.rm_line_weight,0),0) AS "rmCostPerLb",
      COALESCE(wo.fg_rm_line_cost/NULLIF(wo.rm_line_weight,0),0) AS "fgCostPerRmLb",                  -- changed name from rmPerFgLb
      COALESCE(wo.mfg_rm_line_direct_labor/NULLIF(wo.rm_line_weight,0),0) AS "laborPerRmLb",            -- changed name from laborPerLb
      COALESCE(wo.mfg_rm_line_overhead_pool/NULLIF(wo.rm_line_weight,0),0) AS "ohPerRmLb",              -- changed name from ohPerLb
      COALESCE(wo.mfg_rm_line_packaging/NULLIF(wo.rm_line_weight,0),0) AS "packagingPerRmLb",           -- changed name from packagingPerLb
      COALESCE(wo.chem_rm_line_cost/NULLIF(wo.rm_line_weight,0),0) AS "chemPerRmLb",                    -- changed name from chemPerLb
      COALESCE(wo.mfg_rm_line_processing_fee/NULLIF(wo.rm_line_weight,0),0) AS "processingFeePerRmLb"   -- changed name from processingFeePerLb
      
      FROM "woReporting".wo_detail_by_rm AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.rm_from_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        act.wo_group = ${woActivity}
        AND p.formatted_date >= ${startDate} AND p.formatted_date <= ${endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        ${config.trendFilters.speciesGroup ? sql`AND ${config.trendFilters.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.trendFilters.speciesGroup}`}` : sql`` }
        ${config.trendFilters.species ? sql`AND ${config.trendFilters.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.trendFilters.species}`}` : sql`` }
        ${config.trendFilters.program ? sql`AND ${config.trendFilters.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.trendFilters.program}`}` : sql`` }
        ${config.trendFilters.item ? sql`AND ${config.trendFilters.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.trendFilters.item}`}` : sql`` }
        ${config.trendFilters.freshFrozen ? sql`AND ${config.trendFilters.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`}` : sql`` } 
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
        ${config.baseFilters.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.productionCountries)}`: sql``} 
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getProduction_detail
