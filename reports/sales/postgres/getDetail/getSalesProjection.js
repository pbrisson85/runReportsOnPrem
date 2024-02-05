const sql = require('../../../../server')

// FG Program col total for period

const getSalesProjection_detail = async (config, startDate, endDate, useProjection) => {
  try {
    console.log(`${config.user} - level ${config.baseFilters.queryLevel}: query postgres to get SALES PROJECTION ...`)

    const response = await sql
      `SELECT 
        status, 
        pj.net_sales_ext, 
        pj.gross_margin_lb, 
        pj.cost_lb, 
        pj.net_sales_lb, 
        pj.othp_lb, 
        pj.gross_sales_lb, 
        pj.location, 
        pj.customer_code, 
        pj.customer_name, 
        pj.doc_num, 
        pj.line_number, 
        pj.ship_date, 
        pj.week_serial, 
        pj.item_number, 
        ms.description, 
        ms.species, 
        ms.brand, 
        ms.size_name, 
        ms.fg_treatment, 
        ms.fg_fresh_frozen, 
        pj.lbs, 
        pj.gross_sales_ext, 
        pj.othp_ext, 
        pj.cogs_ext, 
        pj.gross_margin_ext, 
        pj.sales_rep, 
        pj.north_america, 
        pj.domestic, 
        pj.country, 
        pj.state 

      FROM (
        SELECT 
          'dummy' AS status, 
          0 AS net_sales_ext, 
          0 AS gross_margin_lb, 
          0 AS cost_lb, 
          0 AS net_sales_lb, 
          0 AS othp_lb, 
          0 AS gross_sales_lb, 
          'dummy' AS location, 
          'dummy' AS customer_code, 
          'dummy' AS customer_name, 
          'dummy' AS doc_num, 
          'dummy' AS line_number, 
          '01-01-2023' AS ship_date, 
          'dummy' AS week_serial, 
          'dummy' AS item_number, 
          0 AS lbs, 
          0 AS gross_sales_ext, 
          0 AS othp_ext, 
          0 AS cogs_ext, 
          0 AS gross_margin_ext, 
          'dummy' AS sales_rep, 
          'dummy' AS north_america, 
          'dummy' AS domestic, 
          'dummy' AS country, 
          'dummy' AS state 
        WHERE 1=2
        
        ${useProjection.sl ? sql`
        UNION ALL
          SELECT 
            'INVOICED' AS status, 
            sl.net_sales_ext, 
            sl.gross_margin_lb, 
            sl.cost_lb, 
            sl.net_sales_lb, 
            sl.othp_lb, 
            sl.gross_sales_lb, 
            sl.location, 
            sl.customer_code, 
            sl.customer_name, 
            sl.invoice_number AS doc_num, 
            sl.line_number, 
            sl.formatted_invoice_date AS ship_date, 
            sl.week_serial, 
            sl.item_number, 
            sl.calc_gm_rept_weight AS lbs, 
            sl.gross_sales_ext, sl.othp_ext, 
            sl.cogs_ext_gl AS cogs_ext, 
            sl.gross_margin_ext, 
            sl.outside_salesperson_code AS sales_rep, 
            sl.north_america, 
            sl.domestic, 
            sl.country, 
            sl.state 
        
          FROM "salesReporting".sales_line_items AS sl 
        
          WHERE 
            sl.formatted_invoice_date >= ${startDate} AND sl.formatted_invoice_date <= ${endDate} 
          `: sql``}

        ${useProjection.so ? sql`
        UNION ALL
          SELECT 
            'UNBILLED' AS status, 
            so.sales_net_ext, 
            so.gross_margin_lb, 
            so.ave_cost_per_lb AS cost_lb, 
            so.sales_net_lb AS net_sales_lb, 
            so.othp_lb, so.unit_price AS gross_sales_lb, 
            so.location, so.customer_code, 
            so.customer_name, 
            so.so_num AS doc_num, 
            so.so_line AS line_number, 
            so.formatted_ship_date AS ship_date, 
            so.week_serial, 
            so.item_num AS item_number, 
            so.ext_weight AS lbs, 
            so.ext_sales AS gross_sales_ext, 
            so.ext_othp AS othp_ext, 
            so.ext_cost AS cogs_ext, 
            so.gross_margin_ext, 
            so.out_sales_rep AS sales_rep, 
            so.north_america, 
            so.domestic, 
            so.country, 
            so.state 
      
          FROM "salesReporting".sales_orders AS so 
          
          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            AND so.formatted_ship_date >= ${startDate} AND so.formatted_ship_date <= ${endDate}
          `: sql``}

        ${useProjection.pr ? sql`
        UNION ALL
            SELECT 
              'PROJECTION' AS status, 
              0 AS sales_net_ext, 
              0 AS gross_margin_lb, 
              0 AS ave_cost_per_lb, 
              0 AS net_sales_lb, 
              0 AS othp_lb, 
              0 AS gross_sales_lb, 
              'NO VALUE' AS location, 
              pr.customer_code, 
              pr.customer_name, 
              'PROJECTION' AS doc_num, 
              'NO VALUE' AS line_number, 
              pr.date AS ship_date, 
              pr.week_serial, 
              pr.item_number, 
              pr.lbs, 
              0 AS gross_sales_ext, 
              0 AS othp_ext, 
              0 AS cogs_ext, 
              0 AS gross_margin_ext, 
              'NEEDED' AS sales_rep, 
              'NEEDED' AS north_america, 
              'NEEDED' AS domestic, 
              'NEEDED' AS country, 
              'NEEDED' AS state

            FROM "salesReporting".projected_sales AS pr        
          
            WHERE 
            pr.date >= ${startDate} AND pr.date <= ${endDate} 
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
            ${config.slice.speciesGroup ? sql`AND ms.species_group = ${config.slice.speciesGroup}`: sql``} 
            ${config.slice.species ? sql`AND ms.species = ${config.slice.species}`: sql``} 
            ${config.slice.program ? sql`AND ms.program = ${config.slice.program}`: sql``}  
            ${config.slice.item ? sql`AND ms.item_num = ${config.slice.item}`: sql``} 
            ${config.slice.customer ? sql`AND pj.customer_code = ${config.slice.customer}`: sql``} 
            ${config.slice.salesPerson ? sql`AND pj.sales_rep = ${config.slice.salesPerson}`: sql``} 
            ${config.slice.custType ? sql`AND cs.category = ${config.slice.custType}`: sql``} 
            ${config.slice.country ? sql`AND pj.country = ${config.slice.country}`: sql``} 
            ${config.slice.state ? sql`AND pj.state = ${config.slice.state}`: sql``} 
            ${config.slice.export ? sql`AND pj.domestic = ${config.slice.export}`: sql``} 
            ${config.slice.northAmerica ? sql`AND pj.north_america = ${config.slice.northAmerica}`: sql``} 
            ${config.slice.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.slice.freshFrozen}`: sql``} 
            ${config.baseFilters.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.baseFilters.queryLevel > 0 ? sql`AND ${sql(config.baseFormat.l1_field)} = ${config.baseFilters.l1_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 1 ? sql`AND ${sql(config.baseFormat.l2_field)} = ${config.baseFilters.l2_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 2 ? sql`AND ${sql(config.baseFormat.l3_field)} = ${config.baseFilters.l3_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 3 ? sql`AND ${sql(config.baseFormat.l4_field)} = ${config.baseFilters.l4_filter}` : sql``} 
            ${config.baseFilters.queryLevel > 4 ? sql`AND ${sql(config.baseFormat.l5_field)} = ${config.baseFilters.l5_filter}` : sql``}
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSalesProjection_detail = getSalesProjection_detail
