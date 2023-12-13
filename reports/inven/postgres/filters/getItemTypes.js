const sql = require('../../../../server')

const getItemTypes = async (fy, config) => {
  try {
    console.log(`query postgres to get list of item types for filters ...`)

    const response = await sql`SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
    FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sl.item_number 
        WHERE 
            ms.item_type IS NOT NULL
            AND sl.fiscal_year = ${fy}
            ${
              config.userPermissions.joeB
                ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                : sql``
            }
                  
    UNION SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
        FROM "invenReporting".perpetual_inventory AS pi
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = pi.item_number 
        WHERE 
            ms.item_type IS NOT NULL
            AND pi.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
            ${
              config.userPermissions.joeB
                ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                : sql``
            } 
                    
    UNION SELECT DISTINCT(TRIM(ms.item_type)) AS label, (TRIM(ms.item_type)) AS "dataName" 
        FROM "salesReporting".sales_orders AS so
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
        WHERE 
            ms.item_type IS NOT NULL
            AND so.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${
              config.userPermissions.joeB
                ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)`
                : sql``
            }
    `

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getItemTypes