const requestEmailNotification = require('../../../../requests/requestEmail')
const sql = require('../../../../../../server')

const getSpeciesGroupTotalSales = async (start, end, program) => {
  try {
    console.log(`look up species group for program ${program} ...`)

    const speciesGroupResponse =
      await sql
      `SELECT DISTINCT(ms.species_group) AS species_group
        FROM "invenReporting".master_supplement AS ms
        WHERE ms.program = ${program}` //prettier-ignore

    // If more than one, notify dev
    if (speciesGroupResponse.length > 1) {
      requestEmailNotification(`Warning: More than one species group found for program ${program} in master_supplement table.`)
    }

    const speciesGroup = speciesGroupResponse[0].species_group

    console.log(`look up species group total sales for ${speciesGroup} ...`)

    const response =
      await sql
        `SELECT COALESCE(SUM(sales_line_items.calc_gm_rept_weight),0) AS lbs, COALESCE(SUM(sales_line_items.gross_sales_ext),0) AS sales, COALESCE(SUM(sales_line_items.cogs_ext_gl),0) AS cogs, COALESCE(SUM(sales_line_items.othp_ext),0) AS othp 
        
        FROM "salesReporting".sales_line_items 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = sales_line_items.item_number
  
        WHERE sales_line_items.formatted_invoice_date >= ${start} AND sales_line_items.formatted_invoice_date <= ${end} AND ms.byproduct_type IS NULL AND ms.item_type = ${'FG'} AND ms.species_group = ${speciesGroup}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getSpeciesGroupTotalSales
