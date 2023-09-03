const sql = require('../../../../../server')

const getRowsFirstLevelDetail = async (config, start, end, showFyTrend, trendQuery) => {
  try {
    console.log(`${config.user} - query postgres to get row labels ...`)

    // NOTE THAT CURRENTLY OPEN POS ARE IN THE INVENTORY TABLE. BELOW WOULD NEED TO QUERY THE PO TABLE IF IT IS MOVED.

    const response = await sql
      `SELECT 
          ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``} 
          ${config.queryLevel} AS datalevel 
        
        FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sl.item_number 
              
        WHERE 
            ${!showFyTrend ? sql`sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} AND ` : sql``} 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
            ${config.customer ? sql`AND sl.customer_code = ${config.customer}`: sql``} 
          
        GROUP BY 
          ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)}`: sql``} 
          ${trendQuery.sl.l2_label ? sql`, ${sql(trendQuery.sl.l2_label)}`: sql``} 
          ${trendQuery.sl.l3_label ? sql`, ${sql(trendQuery.sl.l3_label)}`: sql``} 
          ${trendQuery.sl.l4_label ? sql`, ${sql(trendQuery.sl.l4_label)}`: sql``} 
          ${trendQuery.sl.l5_label ? sql`, ${sql(trendQuery.sl.l5_label)}`: sql``} 
          ${trendQuery.sl.l6_label ? sql`, ${sql(trendQuery.sl.l6_label)}`: sql``} 
          ${trendQuery.sl.l7_label ? sql`, ${sql(trendQuery.sl.l7_label)}`: sql``} 
        
        UNION SELECT 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
          ${config.queryLevel} AS datalevel 
        
        FROM "salesReporting".sales_orders AS so
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = so.item_num 
              
        WHERE 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
            ${config.customer ? sql`AND so.customer_code = ${config.customer}`: sql``} 
          
        GROUP BY 
          ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)}`: sql``} 
          ${trendQuery.so.l2_label ? sql`, ${sql(trendQuery.so.l2_label)}`: sql``} 
          ${trendQuery.so.l3_label ? sql`, ${sql(trendQuery.so.l3_label)}`: sql``} 
          ${trendQuery.so.l4_label ? sql`, ${sql(trendQuery.so.l4_label)}`: sql``} 
          ${trendQuery.so.l5_label ? sql`, ${sql(trendQuery.so.l5_label)}`: sql``} 
          ${trendQuery.so.l6_label ? sql`, ${sql(trendQuery.so.l6_label)}`: sql``} 
          ${trendQuery.so.l7_label ? sql`, ${sql(trendQuery.so.l7_label)}`: sql``}
          
        ${trendQuery.inv.l1_label ? sql`
        
        UNION SELECT 
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.inv.l2_label ? sql`${sql(trendQuery.inv.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.inv.l3_label ? sql`${sql(trendQuery.inv.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.inv.l4_label ? sql`${sql(trendQuery.inv.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.inv.l5_label ? sql`${sql(trendQuery.inv.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.inv.l6_label ? sql`${sql(trendQuery.inv.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.inv.l7_label ? sql`${sql(trendQuery.inv.l7_label)} AS l7_label,`: sql``}
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)} AS l1_label,`: sql``} 
          ${config.queryLevel} AS datalevel 
        
        FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
              
        WHERE 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``}  
          
        GROUP BY 
          ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)}`: sql``} 
          ${trendQuery.inv.l2_label ? sql`, ${sql(trendQuery.inv.l2_label)}`: sql``} 
          ${trendQuery.inv.l3_label ? sql`, ${sql(trendQuery.inv.l3_label)}`: sql``} 
          ${trendQuery.inv.l4_label ? sql`, ${sql(trendQuery.inv.l4_label)}`: sql``} 
          ${trendQuery.inv.l5_label ? sql`, ${sql(trendQuery.inv.l5_label)}`: sql``} 
          ${trendQuery.inv.l6_label ? sql`, ${sql(trendQuery.inv.l6_label)}`: sql``} 
          ${trendQuery.inv.l7_label ? sql`, ${sql(trendQuery.inv.l7_label)}`: sql``}
        
        `: sql``}
        
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
