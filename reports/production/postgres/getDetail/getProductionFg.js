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
      wo.fg_line_item AS item,
      ms.description,
      wo.fg_line_lot_text AS lot_text,
      wo.fg_line_location AS location,
      wo.header_classification AS classification,
      wo.header_class_desc AS class_name,
      wo.header_notes AS notes,
      wo.fg_line_lot AS lot,
      wo.formatted_posting_date AS posting_date,
      ms.species, 
      ms.brand, 
      ms.size_name AS size, 
      ms.fg_treatment AS soak, 
      ms.fg_fresh_frozen AS fresh_frozen,  
      COALESCE(wo.fg_line_weight,0) AS fg_lbs, 
      COALESCE(wo.rm_fg_line_weight,0) AS rm_lbs, 
      COALESCE(wo.chem_fg_line_weight,0) AS chem_lbs,  
      COALESCE(wo.rm_fg_line_cost,0) AS rm_cost,  
      COALESCE(NULLIF(wo.fg_line_weight,0)/NULLIF(wo.rm_fg_line_weight,0),0) AS yield,
      COALESCE(wo.fg_line_extended_cost,0) AS fg_cost,
      COALESCE(wo.mfg_fg_line_ext_direct_labor,0) AS labor, 
      COALESCE(wo.mfg_fg_line_ext_overhead_pool,0) AS oh, 
      COALESCE(wo.mfg_fg_line_ext_packaging,0) AS packaging, 
      COALESCE(wo.chem_fg_line_cost,0) AS chem, 
      COALESCE(wo.mfg_fg_line_ext_processing_fee,0) AS "processingFee", 
      COALESCE(wo.fg_line_extended_cost/NULLIF(wo.fg_line_weight,0),0) AS "costPerLb",
      COALESCE(wo.rm_fg_line_cost/NULLIF(wo.rm_fg_line_weight,0),0) AS "rmPerLb",
      COALESCE(wo.rm_fg_line_cost/NULLIF(wo.fg_line_weight,0),0) AS "rmPerFgLb", 
      COALESCE(wo.mfg_fg_line_ext_direct_labor/NULLIF(wo.fg_line_weight,0),0) AS "laborPerLb",
      COALESCE(wo.mfg_fg_line_ext_overhead_pool/NULLIF(wo.fg_line_weight,0),0) AS "ohPerLb",
      COALESCE(wo.mfg_fg_line_ext_packaging/NULLIF(wo.fg_line_weight,0),0) AS "packagingPerLb",
      COALESCE(wo.chem_fg_line_cost/NULLIF(wo.fg_line_weight,0),0) AS "chemPerLb", 
      COALESCE(wo.mfg_fg_line_ext_processing_fee/NULLIF(wo.fg_line_weight,0),0) AS "processingFeePerLb" 
      
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON wo.formatted_posting_date = p.formatted_date
        LEFT OUTER JOIN wo_activity AS act 
            ON act.item_num = wo.wo_activity_code
        
      WHERE 
        wo.by_prod_fg_line_bool = false
        AND act.wo_group = ${woActivity}
        AND p.formatted_date >= ${startDate} AND p.formatted_date <= ${endDate}
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        ${config.slice.speciesGroup ? sql`AND ${config.slice.speciesGroup === 'NO VALUE' ? sql`ms.species_group IS NULL` : sql`ms.species_group = ${config.slice.speciesGroup}`}` : sql`` }
        ${config.slice.species ? sql`AND ${config.slice.species === 'NO VALUE' ? sql`ms.species IS NULL` : sql`ms.species = ${config.slice.species}`}` : sql`` }
        ${config.slice.program ? sql`AND ${config.slice.program === 'NO VALUE' ? sql`ms.program IS NULL` : sql`ms.program = ${config.slice.program}`}` : sql`` }
        ${config.slice.item ? sql`AND ${config.slice.item === 'NO VALUE' ? sql`ms.item_num IS NULL` : sql`ms.item_num = ${config.slice.item}`}` : sql`` }
        ${config.slice.freshFrozen ? sql`AND ${config.slice.freshFrozen === 'NO VALUE' ? sql`ms.fg_fresh_frozen IS NULL` : sql`ms.fg_fresh_frozen = ${config.slice.freshFrozen}`}` : sql`` } 
        ${config.baseFilters.wo.include1lbWOs.value && !config.baseFilters.wo.includeGreaterlbWOs.value ? sql`AND wo.rm_wo_total_weight < ${config.baseFilters.wo.include1lbWOs.lessThan}`: sql``} 
        ${config.baseFilters.wo.includeGreaterlbWOs.value && !config.baseFilters.wo.include1lbWOs.value ? sql`AND wo.rm_wo_total_weight >= ${config.baseFilters.wo.includeGreaterlbWOs.greaterEqual}`: sql``}
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${config.baseFilters.l1_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l1_field)} IS NULL` : sql`${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${config.baseFilters.l2_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l2_field)} IS NULL` : sql`${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${config.baseFilters.l3_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l3_field)} IS NULL` : sql`${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${config.baseFilters.l4_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l4_field)} IS NULL` : sql`${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}`}` : sql`` }
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${config.baseFilters.l5_filter === 'NO VALUE' ? sql`${sql(config.baseFormat.l5_field)} IS NULL` : sql`${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}`}` : sql`` }
        ${config.baseFilters.wo.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.wo.productionCountries)}`: sql``} 
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getProduction_detail
