const sql = require('../../../server')

const getDistinctPrograms = async config => {
  try {
    console.log(`query postgres to get list of programs for filters ...`)

    const response = await sql`
      SELECT 
        DISTINCT(TRIM(ms.program)) AS label, 
        (TRIM(ms.program)) AS "dataName" 
      FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sales_line_items.item_number 
      WHERE 
        ms.program IS NOT NULL
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}


      UNION SELECT 
        DISTINCT(TRIM(ms.program)) AS label, 
        (TRIM(ms.program)) AS "dataName" 
      FROM "salesReporting".projected_sales 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = projected_sales.item_number 
      WHERE 
        ms.program IS NOT NULL
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}


      UNION SELECT 
        DISTINCT(TRIM(ms.program)) AS label, 
        (TRIM(ms.program)) AS "dataName" 
      FROM "salesReporting".sales_orders 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_orders.item_num 
      WHERE 
        ms.program IS NOT NULL
        AND sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}  
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}

      
      UNION SELECT 
        DISTINCT(TRIM(ms.program)) AS label, 
        (TRIM(ms.program)) AS "dataName" 
      FROM "invenReporting".perpetual_inventory                   -- CURRENTLY PURCHASES ARE IN THE PERPETUAL INVENTORY
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = perpetual_inventory.item_number 
      WHERE 
        ms.program IS NOT NULL
        AND perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}  
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 


      UNION SELECT 
        DISTINCT(TRIM(ms.program)) AS label, 
        (TRIM(ms.program)) AS "dataName" 
      FROM "woReporting".wo_detail_by_fg AS wo
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.fg_line_item 
      WHERE 
        ms.program IS NOT NULL
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``}  
        ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
      ` //prettier-ignore

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
