const sql = require('../../../../server')

const getDistinctPrograms = async config => {
  try {
    console.log(`query postgres to get list of programs for filters ...`)

    const response = await sql`SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" 
        FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number 
              WHERE 
              1 = 1
              ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}
              ${
                config.userPermissions.joeB
                  ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                  : sql``
              }
              
        UNION SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" 
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
                WHERE 
                perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}  
              ${
                config.userPermissions.joeB
                  ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                  : sql``
              } 
                
        UNION SELECT DISTINCT(TRIM(ms.program)) AS label, (TRIM(ms.program)) AS "dataName" 
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
                WHERE 
                sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}  
              ${
                config.userPermissions.joeB
                  ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                  : sql``
              }
        `

    const all = {
      label: 'ALL',
      dataName: 'all',
    }

    const filter = [all, ...response]

    return filter
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getDistinctPrograms
