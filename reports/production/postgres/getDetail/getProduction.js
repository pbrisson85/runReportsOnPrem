const sql = require('../../../../server')

const getProduction_detail = async (config, startDate, endDate, woActivity) => {
  try {
    console.log(`${config.user} - getProduction_detail ...`)

    const response = await sql
      `
      WITH wo_activity AS (
        SELECT ms2.item_num, ms2.wo_activity, ms2.wo_group 
        FROM "invenReporting".master_supplement AS ms2 
        WHERE item_type = 'WO_ACTIVITY'
      )
      
      SELECT 
      wo.wo_num,
      ${woActivity} AS wo_activity, 
      wo.wo_activity_code AS wo_activity_code,
      wo.wo_activity_entity AS entity,
      wo.wo_activity_country AS country,
      wo.fg_line_item AS item,
      ms.description,
      wo.fg_line_lot_text AS lot_text,
      wo.fg_line_location AS location,
      wo.header_classification AS classification,
      wo.header_notes AS notes,
      wo.fg_line_lot AS lot,
      wo.formatted_posting_date AS posting_date,
      ms.species, 
      ms.brand, 
      ms.size_name AS size, 
      ms.fg_treatment AS soak, 
      ms.fg_fresh_frozen AS fresh_frozen,  
      COALESCE(wo.fg_line_weight,0) AS lbs, 
      COALESCE(wo.rm_fg_line_weight,0) AS rm_lbs, 
      COALESCE(NULLIF(wo.fg_line_weight,0)/NULLIF(wo.rm_fg_line_weight,0),0) AS yield,
      COALESCE(wo.fg_line_extended_cost,0) AS cost,
      COALESCE(wo.mfg_fg_line_ext_direct_labor,0) AS labor, 
      COALESCE(wo.mfg_fg_line_ext_overhead_pool,0) AS oh, 
      COALESCE(wo.mfg_fg_line_ext_packaging,0) AS packaging, 
      COALESCE(wo.chem_fg_line_cost,0) AS chem, 
      COALESCE(wo.mfg_fg_line_ext_processing_fee,0) AS "processingFee", 
      COALESCE(wo.fg_line_extended_cost/NULLIF(wo.fg_line_weight,0),0) AS "costPerLb",
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
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
        ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
        ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
        ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
        ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``} 
        ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
        ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
        ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
        ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
        ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``} 
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getProduction_detail
