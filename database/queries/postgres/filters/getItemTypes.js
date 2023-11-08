const sql = require('../../../../server')

const getItemTypes = async (fy, config) => {
  try {
    console.log(`query postgres to get list of item types for filters ...`)

    const response = await sql`SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
    FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number 
        WHERE 
            sales_line_items.fiscal_year = ${fy}
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
                  
    UNION SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
        FROM "invenReporting".perpetual_inventory 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = perpetual_inventory.item_number 
        WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
                    
    UNION SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
        FROM "salesReporting".sales_orders 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_orders.item_num 
        WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    `

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getItemTypes
