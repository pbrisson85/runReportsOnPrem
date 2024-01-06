const sql = require('../../../../server')

const l5_getRowLabels = async config => {
  // config.trends.fyYtd || config.trends.fyFullYear is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsFifthLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, 5 AS datalevel   
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``}  
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
        
        UNION SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label, COALESCE(${sql(config.baseFormat.l5_field)},'NA') AS l5_label, 5 AS datalevel 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getRowLabels = async config => {
  // config.trends.fyYtd || config.trends.fyFullYear is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsFourthLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 4 AS datalevel 
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory)
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``}  
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
        
        UNION SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label, COALESCE(${sql(config.baseFormat.l4_field)},'NA') AS l4_label ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 4 AS datalevel 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}
          ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getRowLabels = async config => {
  // config.trends.fyYtd || config.trends.fyFullYear is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsThirdLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 3 AS datalevel 
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
        
        UNION SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label, COALESCE(${sql(config.baseFormat.l3_field)},'NA') AS l3_label ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 3 AS datalevel 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getRowLabels = async config => {
  // config.trends.fyYtd || config.trends.fyFullYear is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsSecondLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label ${config.baseFormat.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 2 AS datalevel 
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
        
          WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
        
        UNION SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, COALESCE(${sql(config.baseFormat.l2_field)},'NA') AS l2_label ${config.baseFormat.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 2 AS datalevel 
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
        
          WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l1_getRowLabels = async config => {
  // config.trends.fyYtd || config.trends.fyFullYear is a flag to indicate if prior years are being showin. If so then do not filter by date, show all data

  if (!config.baseFormat.l1_field) return []

  try {
    console.log(`${config.user} - query postgres to get row labels (getRowsFirstLevelDetail) ...`)

    const response = await sql
        `SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label ${config.baseFormat.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 1 AS datalevel  
        
          FROM "invenReporting".perpetual_inventory 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = perpetual_inventory.item_number 
          
          WHERE 
            perpetual_inventory.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)} 
        
        UNION SELECT COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 'SUBTOTAL' AS l2_label ${config.baseFormat.l3_field ? sql`, 'SUBTOTAL' AS l3_label`: sql``} ${config.baseFormat.l4_field ? sql`, 'SUBTOTAL' AS l4_label`: sql``} ${config.baseFormat.l5_field ? sql`, 'SUBTOTAL' AS l5_label`: sql``}, 1 AS datalevel   
        
          FROM "salesReporting".sales_orders 
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sales_orders.item_num 
          
          WHERE 
            sales_orders.version = (SELECT MAX(sales_orders.version) - 1 FROM "salesReporting".sales_orders) 
            ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
            ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
          
          GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getRowLabels = async config => {
  const totalsRow = [
    {
      totalRow: true,
      l1_label: `TOTAL`,
      datalevel: 0,
      itemtype: config.baseFilters.itemType,
    },
  ]

  return totalsRow
}

module.exports = { l0_getRowLabels, l1_getRowLabels, l2_getRowLabels, l3_getRowLabels, l4_getRowLabels, l5_getRowLabels }
