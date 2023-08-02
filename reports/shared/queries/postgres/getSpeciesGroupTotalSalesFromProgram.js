const requestEmailNotification = require('../../../../requests/requestEmail')

const getSpeciesGroupTotalSales = async (start, end, program) => {
  try {
    const { Client } = require('pg')
    const pgClient = new Client() // config from ENV
    await pgClient.connect()

    console.log(`look up species group based on program`)

    const speciesGroupResponse = await pgClient.query(
      `SELECT DISTINCT(ms.species_group) AS species_group
        FROM "invenReporting".master_supplement AS ms
        WHERE ms.program = $1`,
      [program]
    ) //prettier-ignore

    // If more than one, notify dev
    if (speciesGroupResponse.rows.length > 1) {
      requestEmailNotification(`Warning: More than one species group found for program ${program} in master_supplement table.`)
    }

    const speciesGroup = speciesGroupResponse.rows[0].species_group

    const response = await pgClient.query(
        `SELECT COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
        
        FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number
  
        WHERE sales_line_items.formatted_invoice_date >= $1 AND sales_line_items.formatted_invoice_date <= $2 AND ms.byproduct_type IS NULL AND ms.item_type = $3 AND ms.species_group = $4`,
        [start, end, 'FG', speciesGroup]
      ) //prettier-ignore

    await pgClient.end()

    return response.rows
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports.getSpeciesGroupTotalSales = getSpeciesGroupTotalSales
