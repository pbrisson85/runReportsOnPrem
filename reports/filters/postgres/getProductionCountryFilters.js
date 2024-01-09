const sql = require('../../../server')

const getProductionCountryFilters = async () => {
  console.log(`query postgres for getProductionCountryFilters ...`)

  const filters = await sql` 
    SELECT 
        DISTINCT(TRIM(ms.program_country)) AS label, 
        (TRIM(ms.program_country)) AS "dataName",
        TRUE AS default 
    FROM "salesReporting".sales_line_items 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number 
    WHERE 
    ms.program_country IS NOT NULL 
    AND ms.wo_entity IS NOT NULL
    ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}` : sql``} 
    ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
    
    `

  return filters
}

module.exports = getProductionCountryFilters
