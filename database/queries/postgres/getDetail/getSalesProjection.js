const sql = require('../../../../server')

// FG Program col total for period

const getSalesProjection_detail = async (config, start, end, year) => {
  try {
    console.log(`${config.user} - level ${config.queryLevel}: query postgres to get SALES PROJECTION ...`)

    const response = await sql
      `SELECT status, pj.net_sales_ext, pj.gross_margin_lb, pj.cost_lb, pj.net_sales_lb, pj.othp_lb, pj.gross_sales_lb, pj.location, pj.customer_code, pj.customer_name, pj.doc_num, pj.line_number, pj.ship_date, pj.week_serial, pj.item_number, ms.description, ms.species, ms.brand, ms.size_name, ms.fg_treatment, ms.fg_fresh_frozen, pj.lbs, pj.gross_sales_ext, pj.othp_ext, pj.cogs_ext, pj.gross_margin_ext, pj.sales_rep, pj.north_america, pj.domestic, pj.country, pj.state 

      FROM (
        SELECT 'BILLED' AS status, sl.net_sales_ext, sl.gross_margin_lb, sl.cost_lb, sl.net_sales_lb, sl.othp_lb, sl.gross_sales_lb, sl.location, sl.customer_code, sl.customer_name, sl.invoice_number AS doc_num, sl.line_number, sl.formatted_invoice_date AS ship_date, sl.week_serial, sl.item_number, sl.calc_gm_rept_weight AS lbs, sl.gross_sales_ext, sl.othp_ext, sl.cogs_ext_gl AS cogs_ext, sl.gross_margin_ext, sl.outside_salesperson_code AS sales_rep, sl.north_america, sl.domestic, sl.country, sl.state 
      
        FROM "salesReporting".sales_line_items AS sl 
       
        WHERE 
          sl.week >= ${start} AND sl.week <= ${end} 
          AND sl.fiscal_year = ${year} 
         
        UNION 
          SELECT 'UNBILLED' AS status, so.net_sales_ext, so.gross_margin_lb, so.ave_cost_per_lb AS cost_lb, so.sales_net_lb AS net_sales_lb, so.othp_lb, so.unit_price AS gross_sales_lb, so.location, so.customer_code, so.customer_name, so.so_num AS doc_num, so.so_line AS line_number, so.formatted_ship_date AS ship_date, so.week_serial, so.item_num AS item_number, so.ext_weight AS lbs, so.ext_sales AS gross_sales_ext, so.ext_othp AS othp_ext, so.ext_cost AS cogs_ext, so.gross_margin_ext, so.out_sales_rep AS sales_rep, so.north_america, so.domestic, so.country, so.state 
      
          FROM "salesReporting".sales_orders AS so 
          
          WHERE 
            so.version = (SELECT MAX(version) - 1 FROM "salesReporting".sales_orders) 
            AND so.week_serial = ${weekSerial} 
          
        ) AS pj

            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = pj.item_number 
            LEFT OUTER JOIN "masters".customer_supplement AS cs 
              ON cs.customer_code = so.customer_code
        
        WHERE 
            ${config.itemType ? sql`AND ms.item_type IN ${sql(config.itemType)}`: sql``} 
            ${config.program ? sql`AND ms.program = ${config.program}`: sql``} 
            ${config.speciesGroup ? sql`AND ms.species_group = ${config.speciesGroup}`: sql``} 
            ${config.species ? sql`AND ms.species = ${config.species}`: sql``} 
            ${config.programDrilldown ? sql`AND ms.program = ${config.programDrilldown}`: sql``}  
            ${config.item ? sql`AND ms.item_num = ${config.item}`: sql``} 
            ${config.customer ? sql`AND pj.customer_code = ${config.customer}`: sql``} 
            ${config.salesPerson ? sql`AND pj.sales_rep = ${config.salesPerson}`: sql``} 
            ${config.custType ? sql`AND cs.category = ${config.custType}`: sql``} 
            ${config.country ? sql`AND pj.country = ${config.country}`: sql``} 
            ${config.state ? sql`AND pj.state = ${config.state}`: sql``} 
            ${config.export ? sql`AND pj.domestic = ${config.export}`: sql``} 
            ${config.northAmerica ? sql`AND pj.north_america = ${config.northAmerica}`: sql``} 
            ${config.freshFrozen ? sql`AND ms.fg_fresh_frozen = ${config.freshFrozen}`: sql``} 
            ${config.jbBuyerFilter ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
            ${config.queryLevel > 0 ? sql`AND ${sql(config.l1_field)} = ${config.l1_filter}` : sql``} 
            ${config.queryLevel > 1 ? sql`AND ${sql(config.l2_field)} = ${config.l2_filter}` : sql``} 
            ${config.queryLevel > 2 ? sql`AND ${sql(config.l3_field)} = ${config.l3_filter}` : sql``} 
            ${config.queryLevel > 3 ? sql`AND ${sql(config.l4_field)} = ${config.l4_filter}` : sql``} 
        ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSalesProjection_detail = getSalesProjection_detail
