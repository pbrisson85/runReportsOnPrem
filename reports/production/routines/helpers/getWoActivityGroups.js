const sql = require('../../../../server')

const getWoActivityGroups = async config => {
  try {
    console.log(`${config.user} - getWoActivityGroups ...`)

    const response = await sql`
        SELECT 
          DISTINCT(ms.wo_group) AS wo_group 
        FROM "invenReporting".master_supplement AS ms 
          LEFT OUTER JOIN "woReporting".wo_detail_by_fg AS wo
          ON ms.item_num = wo.fg_line_item
        WHERE 
          ms.wo_group IS NOT NULL
          AND wo.formatted_posting_date >= ${config.totals.primary.startDate} AND wo.formatted_posting_date <= ${config.totals.primary.endDate}
      ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWoActivityGroups
