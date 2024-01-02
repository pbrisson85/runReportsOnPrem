const sql = require('../../../../server')

const l1_getWeeksOnHand = async (config, trendQuery, useProjection) => {
  if (!config.baseFormat.l1_field) return []
  // loop through config trailing weeks for date ranges and denominators to get ave.

  try {
    console.log(`${config.user} - level 1: query postgres to get FG sales data period total (l1_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
        WITH ave_sales AS (
            SELECT 
            ${trendQuery.sl.l1_label ? sql`pj.l1_label,`: sql``} 
            ${trendQuery.sl.l2_label ? sql`pj.l2_label,`: sql``} 
            ${trendQuery.sl.l3_label ? sql`pj.l3_label,`: sql``}
            ${trendQuery.sl.l4_label ? sql`pj.l4_label,`: sql``}
            ${trendQuery.sl.l5_label ? sql`pj.l5_label,`: sql``}
            ${trendQuery.sl.l6_label ? sql`pj.l6_label,`: sql``}
            ${trendQuery.sl.l7_label ? sql`pj.l7_label,`: sql``}
            SUM(pj.lbs)/${weeks} AS lbs
        
        FROM (
          SELECT
            'dummy' AS item_number,
            'dummy' AS customer_code,
            ${trendQuery.sl.l1_label ? sql`'dummy' AS l1_label,` : sql``} 
            ${trendQuery.sl.l2_label ? sql`'dummy' AS l2_label,` : sql``} 
            ${trendQuery.sl.l3_label ? sql`'dummy' AS l3_label,` : sql``} 
            ${trendQuery.sl.l4_label ? sql`'dummy' AS l4_label,` : sql``} 
            ${trendQuery.sl.l5_label ? sql`'dummy' AS l5_label,` : sql``} 
            ${trendQuery.sl.l6_label ? sql`'dummy' AS l6_label,` : sql``} 
            ${trendQuery.sl.l7_label ? sql`'dummy' AS l7_label,` : sql``} 
            0 AS lbs
  
          FROM "salesReporting".sales_line_items AS sl
  
          WHERE 1=2
  
          ${useProjection.sl ? sql`
          UNION ALL
          SELECT
            sl.item_number,
            sl.customer_code,
            ${trendQuery.sl.l1_label ? sql`${sql(trendQuery.sl.l1_label)} AS l1_label,`: sql``} 
            ${trendQuery.sl.l2_label ? sql`${sql(trendQuery.sl.l2_label)} AS l2_label,`: sql``} 
            ${trendQuery.sl.l3_label ? sql`${sql(trendQuery.sl.l3_label)} AS l3_label,`: sql``} 
            ${trendQuery.sl.l4_label ? sql`${sql(trendQuery.sl.l4_label)} AS l4_label,`: sql``} 
            ${trendQuery.sl.l5_label ? sql`${sql(trendQuery.sl.l5_label)} AS l5_label,`: sql``} 
            ${trendQuery.sl.l6_label ? sql`${sql(trendQuery.sl.l6_label)} AS l6_label,`: sql``} 
            ${trendQuery.sl.l7_label ? sql`${sql(trendQuery.sl.l7_label)} AS l7_label,`: sql``}
            COALESCE(sl.calc_gm_rept_weight,0) AS lbs
  
          FROM "salesReporting".sales_line_items AS sl
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = sl.item_number 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = sl.customer_code
            LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
              ON sl.formatted_invoice_date = p.formatted_date
  
          WHERE 
            sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
            ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
            `: sql``}
  
          ${useProjection.so ? sql`
          UNION ALL
            SELECT 
              so.item_num AS item_number,
              so.customer_code,
              ${trendQuery.so.l1_label ? sql`${sql(trendQuery.so.l1_label)} AS l1_label,`: sql``} 
              ${trendQuery.so.l2_label ? sql`${sql(trendQuery.so.l2_label)} AS l2_label,`: sql``} 
              ${trendQuery.so.l3_label ? sql`${sql(trendQuery.so.l3_label)} AS l3_label,`: sql``} 
              ${trendQuery.so.l4_label ? sql`${sql(trendQuery.so.l4_label)} AS l4_label,`: sql``} 
              ${trendQuery.so.l5_label ? sql`${sql(trendQuery.so.l5_label)} AS l5_label,`: sql``} 
              ${trendQuery.so.l6_label ? sql`${sql(trendQuery.so.l6_label)} AS l6_label,`: sql``} 
              ${trendQuery.so.l7_label ? sql`${sql(trendQuery.so.l7_label)} AS l7_label,`: sql``} 
              COALESCE(so.ext_weight,0) AS lbs
           
            FROM "salesReporting".sales_orders AS so
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = so.item_num 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = so.customer_code
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON so.formatted_ship_date = p.formatted_date
  
            WHERE 
              so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
              AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
              ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
              ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
              ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
              ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
              ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
              ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
              `: sql``}
  
          ${useProjection.pr ? sql`
          UNION ALL
            pr.item_number,
            pr.customer_code,
            ${trendQuery.pr.l1_label ? sql`${sql(trendQuery.pr.l1_label)} AS l1_label,`: sql``} 
            ${trendQuery.pr.l2_label ? sql`${sql(trendQuery.pr.l2_label)} AS l2_label,`: sql``} 
            ${trendQuery.pr.l3_label ? sql`${sql(trendQuery.pr.l3_label)} AS l3_label,`: sql``} 
            ${trendQuery.pr.l4_label ? sql`${sql(trendQuery.pr.l4_label)} AS l4_label,`: sql``} 
            ${trendQuery.pr.l5_label ? sql`${sql(trendQuery.pr.l5_label)} AS l5_label,`: sql``} 
            ${trendQuery.pr.l6_label ? sql`${sql(trendQuery.pr.l6_label)} AS l6_label,`: sql``} 
            ${trendQuery.pr.l7_label ? sql`${sql(trendQuery.pr.l7_label)} AS l7_label,`: sql``} 
            COALESCE(pr.lbs,0) AS lbs
            
            FROM "salesReporting".projected_sales AS pr  
              LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = pr.item_number 
              LEFT OUTER JOIN "masters".customer_supplement AS cs 
                ON cs.customer_code = pr.customer_code 
              LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
                ON pr.date = p.formatted_date
          
            WHERE 
            pr.date >= ${start} AND pr.date <= ${end} 
            ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
            ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
            ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
            ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
            ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
            ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
            `: sql``}
  
        ) AS pj
        
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = pj.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = pj.customer_code
        
        WHERE 
          1=1
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
          ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
          ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
          ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
          ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
          ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
          ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
          ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
          ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        
        GROUP BY
          pj.l1_label
          ${trendQuery.sl.l2_label ? sql`, pj.l2_label`: sql``} 
          ${trendQuery.sl.l3_label ? sql`, pj.l3_label`: sql``} 
          ${trendQuery.sl.l4_label ? sql`, pj.l4_label`: sql``} 
          ${trendQuery.sl.l5_label ? sql`, pj.l5_label`: sql``} 
          ${trendQuery.sl.l6_label ? sql`, pj.l6_label`: sql``} 
          ${trendQuery.sl.l7_label ? sql`, pj.l7_label`: sql``}
        ), --end sales
            
        inv AS (
            SELECT 
                ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)} AS l1_label,`: sql``} 
                ${trendQuery.inv.l2_label ? sql`${sql(trendQuery.inv.l2_label)} AS l2_label,`: sql``} 
                ${trendQuery.inv.l3_label ? sql`${sql(trendQuery.inv.l3_label)} AS l3_label,`: sql``} 
                ${trendQuery.inv.l4_label ? sql`${sql(trendQuery.inv.l4_label)} AS l4_label,`: sql``} 
                ${trendQuery.inv.l5_label ? sql`${sql(trendQuery.inv.l5_label)} AS l5_label,`: sql``} 
                ${trendQuery.inv.l6_label ? sql`${sql(trendQuery.inv.l6_label)} AS l6_label,`: sql``} 
                ${trendQuery.inv.l7_label ? sql`${sql(trendQuery.inv.l7_label)} AS l7_label,`: sql``} 
                COALESCE(SUM(inv.on_hand_lbs),0) AS lbs
            
            FROM "invenReporting".perpetual_inventory AS inv 
                LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                ON ms.item_num = inv.item_number 
            
            WHERE 
                inv.version = (SELECT MAX(perpetual_inventory.version) - 1 FROM "invenReporting".perpetual_inventory) 
                ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
                ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
                ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
                ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
                ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
                ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
                ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
                ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
                ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
                ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
                ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
                ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
                ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
                
            GROUP BY 
            ${trendQuery.inv.l1_label ? sql`${sql(trendQuery.inv.l1_label)}`: sql``} 
            ${trendQuery.inv.l2_label ? sql`, ${sql(trendQuery.inv.l2_label)}`: sql``} 
            ${trendQuery.inv.l3_label ? sql`, ${sql(trendQuery.inv.l3_label)}`: sql``} 
            ${trendQuery.inv.l4_label ? sql`, ${sql(trendQuery.inv.l4_label)}`: sql``} 
            ${trendQuery.inv.l5_label ? sql`, ${sql(trendQuery.inv.l5_label)}`: sql``} 
            ${trendQuery.inv.l6_label ? sql`, ${sql(trendQuery.inv.l6_label)}`: sql``} 
            ${trendQuery.inv.l7_label ? sql`, ${sql(trendQuery.inv.l7_label)}`: sql``}  
            ) --end inv
                
                

            SELECT 
            ${dataName} AS column, 
            s.l1_label,
            ${trendQuery.inv.l2_label ? sql`s.l2_label,`: sql``} 
            ${trendQuery.inv.l3_label ? sql`s.l3_label,`: sql``} 
            ${trendQuery.inv.l4_label ? sql`s.l4_label,`: sql``} 
            ${trendQuery.inv.l5_label ? sql`s.l5_label,`: sql``} 
            ${trendQuery.inv.l6_label ? sql`s.l6_label,`: sql``} 
            ${trendQuery.inv.l7_label ? sql`s.l7_label,`: sql``}
            CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
            
            FROM ave_sales s
            LEFT OUTER JOIN inv i
            ON 
                i.l1_label = s.l1_label
                ${trendQuery.inv.l2_label ? sql`AND i.l2_label = s.l2_label`: sql``}
                ${trendQuery.inv.l3_label ? sql`AND i.l3_label = s.l3_label`: sql``}
                ${trendQuery.inv.l4_label ? sql`AND i.l4_label = s.l4_label`: sql``}
                ${trendQuery.inv.l5_label ? sql`AND i.l5_label = s.l5_label`: sql``}
                ${trendQuery.inv.l6_label ? sql`AND i.l6_label = s.l6_label`: sql``}
                ${trendQuery.inv.l7_label ? sql`AND i.l7_label = s.l7_label`: sql``}
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

const l0_getWeeksOnHand = async (config, useProjection) => {
  try {
    console.log(`${config.user} - level 0: query postgres to get FG sales data period total (l0_getWeeksOnHand) ...`)

    const { dataName, weeks, start, end } = config.trailingWeeksForWeeksInven[0]

    const response = await sql`
    WITH ave_sales AS (
        SELECT 
        'TOTAL' AS l1_label,
        SUM(pj.lbs)/${weeks} AS lbs
    
    FROM (
      SELECT
        'dummy' AS item_number,
        'dummy' AS customer_code,
        0 AS lbs

      FROM "salesReporting".sales_line_items AS sl

      WHERE 1=2

      ${useProjection.sl ? sql`
      UNION ALL
      SELECT
        sl.item_number,
        sl.customer_code,
        COALESCE(sl.calc_gm_rept_weight,0) AS lbs

      FROM "salesReporting".sales_line_items AS sl
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = sl.item_number 
        LEFT OUTER JOIN "masters".customer_supplement AS cs 
          ON cs.customer_code = sl.customer_code
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON sl.formatted_invoice_date = p.formatted_date

      WHERE 
        sl.formatted_invoice_date >= ${start} AND sl.formatted_invoice_date <= ${end} 
        ${config.trendFilters.customer ? sql`AND sl.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND sl.outside_salesperson_code = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND sl.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND sl.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND sl.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND sl.north_america = ${config.trendFilters.northAmerica}`: sql``} 
        `: sql``}

      ${useProjection.so ? sql`
      UNION ALL
        SELECT 
          so.item_num AS item_number,
          so.customer_code,
          COALESCE(so.ext_weight,0) AS lbs
       
        FROM "salesReporting".sales_orders AS so
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = so.item_num 
          LEFT OUTER JOIN "masters".customer_supplement AS cs 
            ON cs.customer_code = so.customer_code
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON so.formatted_ship_date = p.formatted_date

        WHERE 
          so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders)
          AND so.formatted_ship_date >= ${start} AND so.formatted_ship_date <= ${end}
          ${config.trendFilters.customer ? sql`AND so.customer_code = ${config.trendFilters.customer}`: sql``} 
          ${config.trendFilters.salesPerson ? sql`AND so.out_sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
          ${config.trendFilters.country ? sql`AND so.country = ${config.trendFilters.country}`: sql``} 
          ${config.trendFilters.state ? sql`AND so.state = ${config.trendFilters.state}`: sql``} 
          ${config.trendFilters.export ? sql`AND so.domestic = ${config.trendFilters.export}`: sql``} 
          ${config.trendFilters.northAmerica ? sql`AND so.north_america = ${config.trendFilters.northAmerica}`: sql``} 
          `: sql``}

      ${useProjection.pr ? sql`
      UNION ALL
        pr.item_number,
        pr.customer_code,
        COALESCE(pr.lbs,0) AS lbs
          
        FROM "salesReporting".projected_sales AS pr  
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = pr.item_number 
          LEFT OUTER JOIN "masters".customer_supplement AS cs 
            ON cs.customer_code = pr.customer_code 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON pr.date = p.formatted_date
      
        WHERE 
        pr.date >= ${start} AND pr.date <= ${end} 
        ${config.trendFilters.customer ? sql`AND pr.customer_code = ${config.trendFilters.customer}`: sql``} 
        ${config.trendFilters.salesPerson ? sql`AND pr.sales_rep = ${config.trendFilters.salesPerson}`: sql``} 
        ${config.trendFilters.country ? sql`AND pr.country = ${config.trendFilters.country}`: sql``} 
        ${config.trendFilters.state ? sql`AND pr.state = ${config.trendFilters.state}`: sql``} 
        ${config.trendFilters.export ? sql`AND pr.domestic = ${config.trendFilters.export}`: sql``} 
        ${config.trendFilters.northAmerica ? sql`AND pr.north_america = ${config.trendFilters.northAmerica}`: sql``}
        `: sql``}

    ) AS pj
    
    LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
      ON ms.item_num = pj.item_number 
    LEFT OUTER JOIN "masters".customer_supplement AS cs 
      ON cs.customer_code = pj.customer_code
    
    WHERE 
      1=1
      ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
      ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
      ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
      ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
      ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
      ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
      ${config.trendFilters.custType ? sql`AND cs.category = ${config.trendFilters.custType}`: sql``} 
      ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
      ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
      ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
      ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
      ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
    
    
    ), --end sales
        
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
            ${config.trendFilters.speciesGroup ? sql`AND ms.species_group = ${config.trendFilters.speciesGroup}`: sql``}
            ${config.trendFilters.species ? sql`AND ms.species = ${config.trendFilters.species}`: sql``}
            ${config.trendFilters.program ? sql`AND ms.program = ${config.trendFilters.program}`: sql``}
            ${config.trendFilters.item ? sql`AND ms.item_num = ${config.trendFilters.item}`: sql``}  
            ${config.trendFilters.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.trendFilters.freshFrozen}`: sql``}  
            ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}  
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``}
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``}
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
            
       
        ) --end inv
            
            

        SELECT 
        ${dataName} AS column, 
        'TOTAL' AS l1_label,
        CASE WHEN s.lbs <= 0 THEN 99999 ELSE COALESCE(i.lbs/NULLIF(s.lbs,0),0) END AS lbs
        
        FROM ave_sales s
        LEFT OUTER JOIN inv i
        ON 
            i.l1_label = s.l1_label
            
            ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l0_getWeeksOnHand, l1_getWeeksOnHand }
