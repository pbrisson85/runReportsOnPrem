const sql = require('../../../server')

const getWoActivityGroups = async () => {
  try {
    console.log(`getWoActivityGroups ...`)

    const filter = await sql`
      SELECT 
        ms.wo_group AS label, 
        ms.wo_group AS "dataName", 
        ROW_NUMBER() OVER () = 1 AS default, -- first record is default
        ROW_NUMBER() OVER () = 1 AS "trueOnNoSelection" -- first record is true on no selection
      FROM "woReporting".wo_detail_by_fg AS wo 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = wo.wo_activity_code 
      WHERE 
        ms.wo_group IS NOT NULL 
      GROUP BY 
        ms.wo_group 
      ` //prettier-ignore

    return filter
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getWoActivityGroups
