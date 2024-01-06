const sql = require('../../../../server')

const l1_getWeeksOnHand = async config => {
  if (!config.baseFormat.l1_field) return []
  // loop through config trailing weeks for date ranges and denominators to get ave.

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
            'SUBTOTAL' AS l2_label, 
            'SUBTOTAL' AS l3_label, 
            'SUBTOTAL' AS l4_label, 
            'SUBTOTAL' AS l5_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    
                GROUP BY ${sql(config.baseFormat.l1_field)} 
        ),
            
        inv AS (
            SELECT 
                COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
                'SUBTOTAL' AS l2_label, 
                'SUBTOTAL' AS l3_label, 
                'SUBTOTAL' AS l4_label, 
                'SUBTOTAL' AS l5_label, 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            GROUP BY ${sql(config.baseFormat.l1_field)} 
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            s.l2_label,
            s.l3_label,
            s.l4_label,
            s.l5_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
                AND i.l2_label = s.l2_label
                AND i.l3_label = s.l3_label
                AND i.l4_label = s.l4_label
                AND i.l5_label = s.l5_label
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l2_getWeeksOnHand = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres to get FG sales data period total (l2_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
            COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label,
            'SUBTOTAL' AS l3_label, 
            'SUBTOTAL' AS l4_label, 
            'SUBTOTAL' AS l5_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    
                GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
        ),
            
        inv AS (
            SELECT 
                COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
                COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label, 
                'SUBTOTAL' AS l3_label, 
                'SUBTOTAL' AS l4_label, 
                'SUBTOTAL' AS l5_label, 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)} 
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            s.l2_label,
            s.l3_label,
            s.l4_label,
            s.l5_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
                AND i.l2_label = s.l2_label
                AND i.l3_label = s.l3_label
                AND i.l4_label = s.l4_label
                AND i.l5_label = s.l5_label
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l3_getWeeksOnHand = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres to get FG sales data period total (l3_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
            COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label,
            COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label, 
            'SUBTOTAL' AS l4_label, 
            'SUBTOTAL' AS l5_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    
                GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}
        ),
            
        inv AS (
            SELECT 
                COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
                COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label, 
                COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label,
                'SUBTOTAL' AS l4_label, 
                'SUBTOTAL' AS l5_label, 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)} 
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            s.l2_label,
            s.l3_label,
            s.l4_label,
            s.l5_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
                AND i.l2_label = s.l2_label
                AND i.l3_label = s.l3_label
                AND i.l4_label = s.l4_label
                AND i.l5_label = s.l5_label
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l4_getWeeksOnHand = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres to get FG sales data period total (l4_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
            COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label,
            COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label, 
            COALESCE(${sql(config.baseFormat.l4_field)},'BLANK') AS l4_label, 
            'SUBTOTAL' AS l5_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    
                GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
        ),
            
        inv AS (
            SELECT 
                COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
                COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label, 
                COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label, 
                COALESCE(${sql(config.baseFormat.l4_field)},'BLANK') AS l4_label, 
                'SUBTOTAL' AS l5_label, 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)} 
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            s.l2_label,
            s.l3_label,
            s.l4_label,
            s.l5_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
                AND i.l2_label = s.l2_label
                AND i.l3_label = s.l3_label
                AND i.l4_label = s.l4_label
                AND i.l5_label = s.l5_label
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l5_getWeeksOnHand = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres to get FG sales data period total (l4_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
            COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label,
            COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label, 
            COALESCE(${sql(config.baseFormat.l4_field)},'BLANK') AS l4_label, 
            COALESCE(${sql(config.baseFormat.l5_field)},'BLANK') AS l5_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
    
                GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)} 
        ),
            
        inv AS (
            SELECT 
                COALESCE(${sql(config.baseFormat.l1_field)},'BLANK') AS l1_label, 
                COALESCE(${sql(config.baseFormat.l2_field)},'BLANK') AS l2_label, 
                COALESCE(${sql(config.baseFormat.l3_field)},'BLANK') AS l3_label, 
                COALESCE(${sql(config.baseFormat.l4_field)},'BLANK') AS l4_label, 
                COALESCE(${sql(config.baseFormat.l5_field)},'BLANK') AS l5_label, 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
            GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}  
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            s.l2_label,
            s.l3_label,
            s.l4_label,
            s.l5_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
                AND i.l2_label = s.l2_label
                AND i.l3_label = s.l3_label
                AND i.l4_label = s.l4_label
                AND i.l5_label = s.l5_label
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getWeeksOnHand = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            'TOTAL' AS l1_label, 
            SUM(pj.lbs)/${weeks} AS lbs
        
            FROM (
            SELECT 'dummy' AS doc_num, 'dummy' AS line_number, 'dummy' AS item_num, 0 AS lbs 
            FROM "salesReporting".sales_line_items AS d
            WHERE
                1=2
    
            ${config.totals.useProjection.sl ? sql`
            UNION ALL 
                SELECT sl.invoice_number AS doc_num, sl.line_number, sl.item_number AS item_num, COALESCE(sl.calc_gm_rept_weight,0) AS lbs 
                
                FROM "salesReporting".sales_line_items AS sl 
                
                WHERE 
                sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            `: sql``}
    
            ${config.totals.useProjection.so ? sql`
            UNION ALL
                SELECT so.so_num AS doc_num, so.so_line AS line_number, so.item_num AS item_num, COALESCE(so.ext_weight,0) AS lbs 
            
                FROM "salesReporting".sales_orders AS so
                
                WHERE 
                so.version = (SELECT MAX(so1.version) - 1 FROM "salesReporting".sales_orders AS so1)
                AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
            `: sql``}
    
            ${config.totals.useProjection.pr ? sql` 
            UNION ALL
                SELECT 'PROJECTION' AS doc_num, 'PROJECTION' AS line_number, pr.item_number AS item_num, COALESCE(pr.lbs,0) AS lbs
            
                FROM "salesReporting".projected_sales AS pr        
            
                WHERE 
                pr.date >= ${start} AND pr.date <= ${end}
                `: sql``}
    
                ) AS pj
    
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                    ON ms.item_num = pj.item_num
    
                WHERE
                1=1 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
     
        ),
            
        inv AS (
            SELECT 
                'TOTAL' AS l1_label,
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
                
            FROM "invenReporting".perpetual_inventory AS inv
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
                
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            
           
            )
                
                
            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM inv i
            INNER JOIN ave_sales s -- Note this join differs from the same datapoint in the sales report
            ON 
                i.l1_label = s.l1_label
               
                
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getWeeksOnHand, l1_getWeeksOnHand, l2_getWeeksOnHand, l3_getWeeksOnHand, l4_getWeeksOnHand, l5_getWeeksOnHand }
