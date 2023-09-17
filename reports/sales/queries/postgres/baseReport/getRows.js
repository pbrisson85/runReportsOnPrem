const sql = require('../../../../../server')

const getRowsFourthLevelDetail = async (config, start, end, showFyTrend) => {
  // Note showFyTrend is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsFourthLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 4 AS datalevel, "${sql(config.itemType)}" AS itemtype 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            ${!showFyTrend ? sql`AND sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end}` : sql``} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 4 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.l4_field)},'NA') AS l4_label, 4 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}, ${sql(config.l4_field)}
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsThirdLevelDetail = async (config, start, end, showFyTrend) => {
  // Note showFyTrend is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsThirdLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 3 AS datalevel, "${sql(config.itemType)}" AS itemtype  
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            ${!showFyTrend ? sql`AND sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} ` : sql``} 
            ${config.showByProduct ? sql`AND ms.byproduct_type = 'BY PRODUCT'`: sql``} 
            ${config.showSeconds ? sql`AND ms.byproduct_type = 'SECONDS'`: sql``} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 3 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.l3_field)},'NA') AS l3_label ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 3 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}, ${sql(config.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsSecondLevelDetail = async (config, start, end, showFyTrend) => {
  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsSecondLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 2 AS datalevel, "${sql(config.itemType)}" AS itemtype 
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            ${!showFyTrend ? sql`AND sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} ` : sql``} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 2 AS datalevel, "${sql(config.itemType)}" AS itemtype  
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.l2_field)},'NA') AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 2 AS datalevel, "${sql(config.itemType)}" AS itemtype  
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            ms.item_type = ${config.itemType} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ${sql(config.l1_field)}, ${sql(config.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRowsFirstLevelDetail = async (config, start, end, showFyTrend) => {
  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsFirstLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 1 AS datalevel, "${sql(config.itemType)}" AS itemtype  
        
          FROM "salesReporting".sales_line_items 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_line_items.item_number 
          
          WHERE 
            ms.item_type = ${config.itemType} 
            ${!showFyTrend ? sql`AND sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} ` : sql``} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.l1_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 1 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
          
          WHERE 
            ms.item_type = ${config.itemType} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
          
          GROUP BY ${sql(config.l1_field)} 
        
        UNION SELECT COALESCE(${sql(config.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label ${config.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``}, 1 AS datalevel, "${sql(config.itemType)}" AS itemtype   
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
          
          WHERE 
            ms.item_type = ${config.itemType} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
          
          GROUP BY ${sql(config.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getRowsFirstLevelDetail = getRowsFirstLevelDetail
module.exports.getRowsSecondLevelDetail = getRowsSecondLevelDetail
module.exports.getRowsThirdLevelDetail = getRowsThirdLevelDetail
module.exports.getRowsFourthLevelDetail = getRowsFourthLevelDetail
