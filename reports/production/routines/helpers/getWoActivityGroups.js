const sql = require('../../../../server')

const getWoActivityGroups = async config => {
  try {
    console.log(`${config.user} - getWoActivityGroups ...`)

    const response = await sql`
          SELECT 
            ms.wo_group
          FROM "woReporting".wo_detail_by_fg AS wo
            LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
              ON ms.item_num = wo.wo_activity_code
          WHERE 
            ms.wo_group IS NOT NULL 
            AND wo.formatted_posting_date >= ${config.totals.primary.startDate} AND wo.formatted_posting_date <= ${config.totals.primary.endDate}
          GROUP BY 
            ms.wo_group
          
      ` //prettier-ignore

    const wo_groups = response.map(wo => wo.wo_group)

    return wo_groups
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWoActivityGroups
