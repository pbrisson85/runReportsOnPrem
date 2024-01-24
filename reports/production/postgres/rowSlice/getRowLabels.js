const sql = require('../../../../server')

const l1_getRowLabels = async (config, trendQuery) => {
  try {
    console.log(`${config.user} - query postgres to get row labels ...`)

    // NOTE THAT CURRENTLY OPEN POS ARE IN THE INVENTORY TABLE. BELOW WOULD NEED TO QUERY THE PO TABLE IF IT IS MOVED.
    // ****** MORE IMPORTANTLY. NOTE THAT ON A SLICE I DO NOT WANT LABELS THAT DONT RELATE TO THE ACTUAL WO ITEMS IN THE SLICE. I HAVE ADDED A FILTER TO THE L1 SLICE FOR ALL NON WO QUERIES. GIVEN THIS, I ONLY NEED TO PULL ROWS FROM WO/PRODUCTION TABLES. COMMENTING OUT ALL OTHER ROWS. ******

    const response = await sql
        `
        SELECT 
          ${trendQuery.wo.l1_label ? sql`COALESCE(${sql(trendQuery.wo.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.wo.l2_label ? sql`COALESCE(${sql(trendQuery.wo.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.wo.l3_label ? sql`COALESCE(${sql(trendQuery.wo.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.wo.l4_label ? sql`COALESCE(${sql(trendQuery.wo.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.wo.l5_label ? sql`COALESCE(${sql(trendQuery.wo.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.wo.l6_label ? sql`COALESCE(${sql(trendQuery.wo.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.wo.l7_label ? sql`COALESCE(${sql(trendQuery.wo.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "woReporting".wo_detail_by_fg AS wo
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = wo.fg_line_item 
          LEFT OUTER JOIN "invenReporting".master_supplement AS act
            ON act.item_num = wo.wo_activity_code
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON wo.formatted_posting_date = p.formatted_date

        WHERE 
          1=1
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          ${config.baseFilters.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.productionCountries)}`: sql``}
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouinvng)} IN ${sql(config.trends.yearTrend.years)}
            ` }  
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
        GROUP BY 
          ${trendQuery.wo.l1_label ? sql`${sql(trendQuery.wo.l1_label)}`: sql``} 
          ${trendQuery.wo.l2_label ? sql`, ${sql(trendQuery.wo.l2_label)}`: sql``} 
          ${trendQuery.wo.l3_label ? sql`, ${sql(trendQuery.wo.l3_label)}`: sql``} 
          ${trendQuery.wo.l4_label ? sql`, ${sql(trendQuery.wo.l4_label)}`: sql``} 
          ${trendQuery.wo.l5_label ? sql`, ${sql(trendQuery.wo.l5_label)}`: sql``} 
          ${trendQuery.wo.l6_label ? sql`, ${sql(trendQuery.wo.l6_label)}`: sql``} 
          ${trendQuery.wo.l7_label ? sql`, ${sql(trendQuery.wo.l7_label)}`: sql``} 


        
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    console.log(error.query)
    return error
  }
}

const l0_getRowLabels = async config => {
  const totalsRow = [
    {
      totalRow: true,
      l1_label: `TOTAL`,
      datalevel: config.baseFilters.queryLevel,
      itemtype: config.baseFilters.itemType,
    },
  ]

  return totalsRow
}

module.exports = { l0_getRowLabels, l1_getRowLabels }

/*
`
        SELECT 
          ${trendQuery.inv.l1_label ? sql`COALESCE(${sql(trendQuery.inv.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.inv.l2_label ? sql`COALESCE(${sql(trendQuery.inv.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.inv.l3_label ? sql`COALESCE(${sql(trendQuery.inv.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.inv.l4_label ? sql`COALESCE(${sql(trendQuery.inv.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.inv.l5_label ? sql`COALESCE(${sql(trendQuery.inv.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.inv.l6_label ? sql`COALESCE(${sql(trendQuery.inv.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.inv.l7_label ? sql`COALESCE(${sql(trendQuery.inv.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "invenReporting".perpetual_inventory AS inv
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = inv.item_number 
        WHERE 
          inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        GROUP BY 
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)}`: sql``} 
          ${trendQuery.inv.l2_label ? sql`, ${sql(trendQuery.inv.l2_label)}`: sql``} 
          ${trendQuery.inv.l3_label ? sql`, ${sql(trendQuery.inv.l3_label)}`: sql``} 
          ${trendQuery.inv.l4_label ? sql`, ${sql(trendQuery.inv.l4_label)}`: sql``} 
          ${trendQuery.inv.l5_label ? sql`, ${sql(trendQuery.inv.l5_label)}`: sql``} 
          ${trendQuery.inv.l6_label ? sql`, ${sql(trendQuery.inv.l6_label)}`: sql``} 
          ${trendQuery.inv.l7_label ? sql`, ${sql(trendQuery.inv.l7_label)}`: sql``}  
        

        UNION SELECT 
          ${trendQuery.sl.l1_label ? sql`COALESCE(${sql(trendQuery.sl.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.sl.l2_label ? sql`COALESCE(${sql(trendQuery.sl.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.sl.l3_label ? sql`COALESCE(${sql(trendQuery.sl.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.sl.l4_label ? sql`COALESCE(${sql(trendQuery.sl.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.sl.l5_label ? sql`COALESCE(${sql(trendQuery.sl.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.sl.l6_label ? sql`COALESCE(${sql(trendQuery.sl.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.sl.l7_label ? sql`COALESCE(${sql(trendQuery.sl.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "salesReporting".sales_line_items AS sl 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sl.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON sl.formatted_invoice_date = p.formatted_date
        WHERE 
          ${config.baseFilters.itemType ? sql`ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql`ms.item_type IS NOT NULL`} 
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouinvng)} IN ${sql(config.trends.yearTrend.years)}
            ` }
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
            ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
            ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
            ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
            ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        GROUP BY 
          ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)}`: sql``} 
          ${trendQuery.sl.l2_label ? sql`, ${sql(trendQuery.sl.l2_label)}`: sql``} 
          ${trendQuery.sl.l3_label ? sql`, ${sql(trendQuery.sl.l3_label)}`: sql``} 
          ${trendQuery.sl.l4_label ? sql`, ${sql(trendQuery.sl.l4_label)}`: sql``} 
          ${trendQuery.sl.l5_label ? sql`, ${sql(trendQuery.sl.l5_label)}`: sql``} 
          ${trendQuery.sl.l6_label ? sql`, ${sql(trendQuery.sl.l6_label)}`: sql``} 
          ${trendQuery.sl.l7_label ? sql`, ${sql(trendQuery.sl.l7_label)}`: sql``}  


        UNION SELECT 
          ${trendQuery.so.l1_label ? sql`COALESCE(${sql(trendQuery.so.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.so.l2_label ? sql`COALESCE(${sql(trendQuery.so.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.so.l3_label ? sql`COALESCE(${sql(trendQuery.so.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.so.l4_label ? sql`COALESCE(${sql(trendQuery.so.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.so.l5_label ? sql`COALESCE(${sql(trendQuery.so.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.so.l6_label ? sql`COALESCE(${sql(trendQuery.so.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.so.l7_label ? sql`COALESCE(${sql(trendQuery.so.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
        WHERE 
          so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``} 
        GROUP BY 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)}`: sql``} 
          ${trendQuery.so.l2_label ? sql`, ${sql(trendQuery.so.l2_label)}`: sql``} 
          ${trendQuery.so.l3_label ? sql`, ${sql(trendQuery.so.l3_label)}`: sql``} 
          ${trendQuery.so.l4_label ? sql`, ${sql(trendQuery.so.l4_label)}`: sql``} 
          ${trendQuery.so.l5_label ? sql`, ${sql(trendQuery.so.l5_label)}`: sql``} 
          ${trendQuery.so.l6_label ? sql`, ${sql(trendQuery.so.l6_label)}`: sql``} 
          ${trendQuery.so.l7_label ? sql`, ${sql(trendQuery.so.l7_label)}`: sql``} 

        
        UNION SELECT 
          ${trendQuery.wo.l1_label ? sql`COALESCE(${sql(trendQuery.wo.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.wo.l2_label ? sql`COALESCE(${sql(trendQuery.wo.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.wo.l3_label ? sql`COALESCE(${sql(trendQuery.wo.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.wo.l4_label ? sql`COALESCE(${sql(trendQuery.wo.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.wo.l5_label ? sql`COALESCE(${sql(trendQuery.wo.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.wo.l6_label ? sql`COALESCE(${sql(trendQuery.wo.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.wo.l7_label ? sql`COALESCE(${sql(trendQuery.wo.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "woReporting".wo_detail_by_fg AS wo
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = wo.fg_line_item 
          LEFT OUTER JOIN "invenReporting".master_supplement AS act
            ON act.item_num = wo.wo_activity_code
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON wo.formatted_posting_date = p.formatted_date

        WHERE 
          1=1
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          ${config.baseFilters.productionCountries ? sql`AND act.program_country IN ${sql(config.baseFilters.productionCountries)}`: sql``}
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouinvng)} IN ${sql(config.trends.yearTrend.years)}
            ` }  
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
        GROUP BY 
          ${trendQuery.wo.l1_label ? sql`${sql(trendQuery.wo.l1_label)}`: sql``} 
          ${trendQuery.wo.l2_label ? sql`, ${sql(trendQuery.wo.l2_label)}`: sql``} 
          ${trendQuery.wo.l3_label ? sql`, ${sql(trendQuery.wo.l3_label)}`: sql``} 
          ${trendQuery.wo.l4_label ? sql`, ${sql(trendQuery.wo.l4_label)}`: sql``} 
          ${trendQuery.wo.l5_label ? sql`, ${sql(trendQuery.wo.l5_label)}`: sql``} 
          ${trendQuery.wo.l6_label ? sql`, ${sql(trendQuery.wo.l6_label)}`: sql``} 
          ${trendQuery.wo.l7_label ? sql`, ${sql(trendQuery.wo.l7_label)}`: sql``} 


        UNION SELECT 
          ${trendQuery.po.l1_label ? sql`COALESCE(${sql(trendQuery.po.l1_label)},'NO VALUE') AS l1_label,`: sql``} 
          ${trendQuery.po.l2_label ? sql`COALESCE(${sql(trendQuery.po.l2_label)},'NO VALUE') AS l2_label,`: sql``} 
          ${trendQuery.po.l3_label ? sql`COALESCE(${sql(trendQuery.po.l3_label)},'NO VALUE') AS l3_label,`: sql``} 
          ${trendQuery.po.l4_label ? sql`COALESCE(${sql(trendQuery.po.l4_label)},'NO VALUE') AS l4_label,`: sql``} 
          ${trendQuery.po.l5_label ? sql`COALESCE(${sql(trendQuery.po.l5_label)},'NO VALUE') AS l5_label,`: sql``} 
          ${trendQuery.po.l6_label ? sql`COALESCE(${sql(trendQuery.po.l6_label)},'NO VALUE') AS l6_label,`: sql``} 
          ${trendQuery.po.l7_label ? sql`COALESCE(${sql(trendQuery.po.l7_label)},'NO VALUE') AS l7_label,`: sql``} 
          ${config.baseFilters.queryLevel} AS datalevel 
        FROM "purchaseReporting".po_data AS po 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = po.item_number
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON po.receipt_date = p.formatted_date
        WHERE 
          po.po_offset = FALSE
          AND po.extended_cost <> 0 
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          ${!config.trends.yearTrend ? sql`
                AND p.formatted_date >= ${config.totals.primary.startDate} 
                AND p.formatted_date <= ${config.totals.primary.endDate}` : 
              sql`
                AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
                AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
                AND ${sql(config.trends.queryGrouinvng)} IN ${sql(config.trends.yearTrend.years)}
              ` }
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
        GROUP BY
          ${trendQuery.po.l1_label ? sql`${sql(trendQuery.po.l1_label)}`: sql``} 
          ${trendQuery.po.l2_label ? sql`, ${sql(trendQuery.po.l2_label)}`: sql``} 
          ${trendQuery.po.l3_label ? sql`, ${sql(trendQuery.po.l3_label)}`: sql``} 
          ${trendQuery.po.l4_label ? sql`, ${sql(trendQuery.po.l4_label)}`: sql``} 
          ${trendQuery.po.l5_label ? sql`, ${sql(trendQuery.po.l5_label)}`: sql``} 
          ${trendQuery.po.l6_label ? sql`, ${sql(trendQuery.po.l6_label)}`: sql``} 
          ${trendQuery.po.l7_label ? sql`, ${sql(trendQuery.po.l7_label)}`: sql``} 
          ` 

*/
