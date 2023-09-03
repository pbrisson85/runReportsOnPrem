const sql = require('../../../../../server')

const getRowsFirstLevelDetail = async (config, start, end, showFyTrend, trendQuery) => {
  try {
    console.log(`${config.user} - query postgres to get row labels ...`)

    // NOTE THAT CURRENTLY OPEN POS ARE IN THE INVENTORY TABLE. BELOW WOULD NEED TO QUERY THE PO TABLE IF IT IS MOVED.

    const response = await sql
      `SELECT 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.l2_label ? sql`${sql(trendQuery.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.l3_label ? sql`${sql(trendQuery.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.l4_label ? sql`${sql(trendQuery.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.l5_label ? sql`${sql(trendQuery.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.l6_label ? sql`${sql(trendQuery.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.l7_label ? sql`${sql(trendQuery.l7_label)} AS l7_label,`: sql``} 
          ${config.queryLevel} AS datalevel 
        
        FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
              
        WHERE 
            ${!showFyTrend ? sql`sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ` : sql``} 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
            ${config.customer ? sql`AND sales_line_items.customer_code = ${config.customer}`: sql``} 
          
        GROUP BY 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)}`: sql``} 
          ${trendQuery.l2_label ? sql`, ${sql(trendQuery.l2_label)}`: sql``} 
          ${trendQuery.l3_label ? sql`, ${sql(trendQuery.l3_label)}`: sql``} 
          ${trendQuery.l4_label ? sql`, ${sql(trendQuery.l4_label)}`: sql``} 
          ${trendQuery.l5_label ? sql`, ${sql(trendQuery.l5_label)}`: sql``} 
          ${trendQuery.l6_label ? sql`, ${sql(trendQuery.l6_label)}`: sql``} 
          ${trendQuery.l7_label ? sql`, ${sql(trendQuery.l7_label)}`: sql``} 
        
        UNION SELECT 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.l2_label ? sql`${sql(trendQuery.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.l3_label ? sql`${sql(trendQuery.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.l4_label ? sql`${sql(trendQuery.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.l5_label ? sql`${sql(trendQuery.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.l6_label ? sql`${sql(trendQuery.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.l7_label ? sql`${sql(trendQuery.l7_label)} AS l7_label,`: sql``} 
          ${config.queryLevel} AS datalevel 
        
        FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
              
        WHERE 
            ms.byproduct_type IS NULL 
            AND ms.item_type = ${'FG'} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders)  
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``}
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
            ${config.customer ? sql`AND sales_orders.customer_code = ${config.customer}`: sql``} 
          
        GROUP BY 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)}`: sql``} 
          ${trendQuery.l2_label ? sql`, ${sql(trendQuery.l2_label)}`: sql``} 
          ${trendQuery.l3_label ? sql`, ${sql(trendQuery.l3_label)}`: sql``} 
          ${trendQuery.l4_label ? sql`, ${sql(trendQuery.l4_label)}`: sql``} 
          ${trendQuery.l5_label ? sql`, ${sql(trendQuery.l5_label)}`: sql``} 
          ${trendQuery.l6_label ? sql`, ${sql(trendQuery.l6_label)}`: sql``} 
          ${trendQuery.l7_label ? sql`, ${sql(trendQuery.l7_label)}`: sql``}
          
        UNION SELECT 
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)} AS l1_label,`: sql``} 
          ${trendQuery.l2_label ? sql`${sql(trendQuery.l2_label)} AS l2_label,`: sql``} 
          ${trendQuery.l3_label ? sql`${sql(trendQuery.l3_label)} AS l3_label,`: sql``} 
          ${trendQuery.l4_label ? sql`${sql(trendQuery.l4_label)} AS l4_label,`: sql``} 
          ${trendQuery.l5_label ? sql`${sql(trendQuery.l5_label)} AS l5_label,`: sql``} 
          ${trendQuery.l6_label ? sql`${sql(trendQuery.l6_label)} AS l6_label,`: sql``} 
          ${trendQuery.l7_label ? sql`${sql(trendQuery.l7_label)} AS l7_label,`: sql``} 
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
          ${trendQuery.l1_label ? sql`${sql(trendQuery.l1_label)}`: sql``} 
          ${trendQuery.l2_label ? sql`, ${sql(trendQuery.l2_label)}`: sql``} 
          ${trendQuery.l3_label ? sql`, ${sql(trendQuery.l3_label)}`: sql``} 
          ${trendQuery.l4_label ? sql`, ${sql(trendQuery.l4_label)}`: sql``} 
          ${trendQuery.l5_label ? sql`, ${sql(trendQuery.l5_label)}`: sql``} 
          ${trendQuery.l6_label ? sql`, ${sql(trendQuery.l6_label)}`: sql``} 
          ${trendQuery.l7_label ? sql`, ${sql(trendQuery.l7_label)}`: sql``}
        
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
